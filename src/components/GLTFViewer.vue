<script setup lang="ts">
import { usePreferredColorScheme } from '@vueuse/core'
import { Box3, MathUtils, Quaternion, Vector3 } from 'three'
import { ref, watch } from 'vue'
import { fixUrlForProd } from '@/env'
import ClusterMode from '@/types/ClusterMode'
import ShapeName from '@/types/ShapeName'
import type ModelInfo from '@/types/ModelInfo'
import type { GLTFLoader, Matrix3, Mesh, MeshArrayDict } from '@/types/ThreeTypes'

const { lerp } = MathUtils

const props = defineProps<{
  cameraPosition: Matrix3,
  invisibleMaterialName?: string,
  modelPosition: Matrix3,
  modelUrl: string,
  reportModelInfo: (info: ModelInfo) => void,
  selectedMode: ClusterMode,
}>()

const model = ref<null | GLTFLoader>(null) // null before the model loads
const colorScheme = usePreferredColorScheme() // tracks CSS prefers-color-scheme

/** All of the individually-positionable Meshes in the model. */
const meshes = ref<Mesh[]>([])

/** A number between 0 and 1 which represents the current position in the
  * 'tween' timeline. Reset to 0, every time the user clicks a 'Cluster' button. */
const interpolation = ref(0)
// const previousClusterMode = ref(props.selectedMode)
watch(() => props.selectedMode, async (_next, _previous) => {
  interpolation.value = 0
  // previousClusterMode.value = previous
})

// Initialise variables and constants used by onAnimationFrame() which don't
// need to be reactive.
let previousTimestamp = performance.now()
const zAxis = new Vector3(0, 0, 1)
let currentSidewaysAngle = 0

// Updates the Three scene. Called approximately 60 times a second.
const onAnimationFrame = () => {

  // Keep recording the duration of the most recent animation frame, even if the
  // model has not loaded yet, or the interpolation has ended.
  const currentTimestamp = performance.now()
  const frameDuration = currentTimestamp - previousTimestamp
  previousTimestamp = currentTimestamp

  // If the model has not loaded, or the interpolation has ended, do nothing else.
  if (model.value === null || interpolation.value >= 1) return

  // When the user clicks a button, interpolating to that position takes 5 seconds.
  // Note that the way lerp() is used below means that most of the movement will
  // finish after about half a second.
  interpolation.value += frameDuration / 5000

  // Cache values which wont change during the tight `forEach` loop, below.
  const tween = interpolation.value
  const nextMode = props.selectedMode
  const switchToNextVisibility = tween > (nextMode === ClusterMode.Original ? 0.2 : 0.02)
  // const previousMode = previousClusterMode.value

  // Calculate the 'sideways angle', for Meshes which should rotate 90 degrees.
  // This allows 'facing' and 'sideways' walls and plasterboard to line up neatly.
  const targetAngle = nextMode === ClusterMode.Original ? 0 : Math.PI / 2
  const nextSidewaysAngle = lerp(currentSidewaysAngle, targetAngle, tween)
  const deltaSidewaysAngle = nextSidewaysAngle - currentSidewaysAngle
  currentSidewaysAngle = nextSidewaysAngle
  
  // Linearly interpolate each Mesh between its current and target offsets.
  // The slightly nonstandard use of lerp() provides an 'easing' effect, and
  // allows the animation to smoothly change from one target to another, mid-tween.
  //
  // Also, update Mesh visibility to the next value, part way through the tween.
  // @TODO just switch mesh.visible once during a tween.
  // @TODO don't modify position and rotation of invisible Meshes.
  meshes.value.forEach(mesh => {
    const { shapeName, offset } = mesh.userData
    if (
      shapeName === ShapeName.PlaneLandscapeSideways ||
      shapeName === ShapeName.PlanePortraitSideways ||
      shapeName === ShapeName.PlaneSquareSideways
    ) {
      const boundingBox: Box3 = mesh.children[0].geometry.boundingBox
      const center = new Vector3()
      boundingBox.getCenter(center)
      rotateAroundWorldAxis(mesh.children[0], center, zAxis, deltaSidewaysAngle)
    }
    mesh.position.lerp(offset[nextMode], tween)
    if (switchToNextVisibility) mesh.visible = mesh.userData.visible[nextMode]
  })
}

// Rotate object around axis in world space (the axis passes through point).
// Axis is assumed to be normalized.
// Assumes object does not have a rotated parent.
// Based on https://stackoverflow.com/a/32038265
const quaternion = new Quaternion()
const rotateAroundWorldAxis = (mesh: Mesh, point: Vector3, axis: Vector3, angle: number) => {
    quaternion.setFromAxisAngle(axis, angle)
    mesh.applyQuaternion(quaternion)
    mesh.position.sub(point)
    mesh.position.applyQuaternion(quaternion)
    mesh.position.add(point)
}

// Identifies a Mesh's geometry as a 'Pillar', or 'MediumPlane', etc.
// This function relies on a model where all geometries are aligned to the x, y
// and z axis.
//
// Note that the `1.2` used to differentiate between landscape, portrait and
// square planes is a magic number, tuned to apartment.glb.
const boundingBoxToShapeName = (mesh?: Mesh) => {
  if (! mesh?.geometry) return ShapeName.Unknown // probably never encountered
  const boundingBox: Box3 = mesh.geometry.boundingBox
  const dimensions = new Vector3()
  boundingBox.getSize(dimensions) // note that y is depth, not height
  const { x: width, y: depth, z: height } = dimensions
  const w5 = width * 5
  const d5 = depth * 5
  const h5 = height * 5
  switch (true) {
    // A shape whose width is much greater than its height or depth.
    case width > h5 && width > d5: return ShapeName.BeamFacing
    // A shape whose depth is much greater than its width or height.
    case depth > w5 && depth > h5: return ShapeName.BeamSideways
    // A horizontal plane, like a floor or ceiling.
    case h5 < width && h5 < depth: return ShapeName.HorizontalPlane
    // A shape whose height is very much greater than its width or depth.
    case height > w5 * 2 && height > d5 * 2: return ShapeName.Pillar
    // A vertical plane which extends in the 'width' direction.
    case d5 < width && d5 < height:
      return width > height * 1.2
        ? ShapeName.PlaneLandscapeFacing
        : height > width * 1.2
          ? ShapeName.PlanePortraitFacing
          : ShapeName.PlaneSquareFacing
    // A vertical plane which extends in the 'depth' direction.
    case w5 < height && w5 < depth:
      return depth > height * 1.2
        ? ShapeName.PlaneLandscapeSideways
        : height > depth * 1.2
          ? ShapeName.PlanePortraitSideways
          : ShapeName.PlaneSquareSideways
    // Doesn't conform to any of the other shapes, so must be somewhat boxy.
    default: return ShapeName.Block
  }
}

const getBoundingBoxOffset = (origin: Vector3, mesh?: Mesh): Vector3 => {
  if (! mesh?.geometry) return new Vector3(0, 0, 0) // probably never encountered
  const boundingBox: Box3 = mesh.geometry.boundingBox
  const center = new Vector3()
  boundingBox.getCenter(center)
  return center.sub(origin).negate() // negate() sets x = -x, y = -y and z = -z
}

// Returns the coordinates of a cluster's center.
//
// The choice of coordinates has been tailored to the specific apartment.glb and
// building.glb - a more complex system would be needed to deal with a wider
// range of glTF models.
const getClusterCenter = (
  index: number,
  key: number | string,
  spacing: number,
  totalItems: number,
) => {
  // Return a bespoke arrangement for the building.glb's materials.
  if (totalItems === 4) {
    switch (Number(key)) {
      case ShapeName.BeamSideways: return new Vector3(0, 0, 0)
      case ShapeName.Block: return new Vector3(spacing * -2, spacing, 0)
      case ShapeName.Pillar: return new Vector3(spacing * -0.3, 0, 47)
      case ShapeName.HorizontalPlane: return new Vector3(-spacing, 0, 0)
    }
  }
  if (totalItems === 6) {
    // Return a bespoke arrangement for the apartment.glb's materials.
    switch (Number(key)) {
      case ShapeName.PlaneLandscapeFacing: return new Vector3(-6, 0, 0)
      case ShapeName.PlaneLandscapeSideways: return new Vector3(-6, 4.5, 0)
      case ShapeName.PlanePortraitFacing: return new Vector3(0, 0, 0)
      case ShapeName.PlanePortraitSideways: return new Vector3(0, 4.4, 0)
      case ShapeName.PlaneSquareFacing: return new Vector3(4, 2, 0)
      case ShapeName.PlaneSquareSideways: return new Vector3(4, 2.7, 0)
    }
    // Otherwise, calculate a general purpose arrangement.
    const x = index % 2
    const y = (index - x) / 2
    return new Vector3(x * spacing - 1, y * spacing - 1.5, 1.5)
  }
  if (totalItems === 9) {
    const x = index % 3
    const y = (index - x) / 3
    return new Vector3(x * spacing - 70, y * spacing - 70, 0)
  }
  return new Vector3(index * - spacing, 0, 0)
}

// Precalculates the clusters, to minimise the work during animation.
const onModelLoaded = () => {
  if (model.value === null) return

  // Populate the `meshes` reference with an array of Meshes, which will each be
  // treated as an individually-positionable 3D object.
  // `children[0].children[0].children` depends on the structure of the models.
  meshes.value = model.value.three.children[0].children[0].children  

  // Tell each Mesh which material cluster its in, and group Meshes by material name.
  const meshesByMaterialName: MeshArrayDict = meshes.value.reduce(
    (accumulator: MeshArrayDict, mesh) => {
      const key: string = mesh.children[0]?.material?.name
      mesh.userData.materialName = key
      const array = accumulator[key]
      if (array) {
        array.push(mesh)
      } else {
        accumulator[key] = [ mesh ]
      }
      return accumulator
    }, {}
  )

  // Tell each Mesh which shape cluster its in, and group Meshes by shape name.
  // A shape is determined by the geometry's bounding box.
  // Also, store whether the mesh should rotate 90 degrees when clustered.
  const meshesByShapeName: MeshArrayDict = meshes.value.reduce(
    (accumulator: MeshArrayDict, mesh) => {
      const shapeName = boundingBoxToShapeName(mesh.children[0])
      mesh.userData.shapeName = shapeName
      const array = accumulator[shapeName]
      if (array) {
        array.push(mesh)
      } else {
        accumulator[shapeName] = [ mesh ]
      }
      return accumulator
    }, {}
  )

  // Send the tally of materials and shapes to the InfoBox.
  // The `invisibleMaterialName` prop isn't counted, eg apartment.glb's black lines.
  const materialTally = Object.keys(meshesByMaterialName)
    .filter(k => k !== props.invisibleMaterialName).length
  const shapeTally = Object.keys(meshesByShapeName).length
  let displayedShapeTally = shapeTally
  if (
    meshesByShapeName[ShapeName.PlaneLandscapeFacing] &&
    meshesByShapeName[ShapeName.PlaneLandscapeSideways]
  ) displayedShapeTally -= 1
  if (
    meshesByShapeName[ShapeName.PlanePortraitFacing] &&
    meshesByShapeName[ShapeName.PlanePortraitSideways]
  ) displayedShapeTally -= 1
  if (
    meshesByShapeName[ShapeName.PlaneSquareFacing] &&
    meshesByShapeName[ShapeName.PlaneSquareSideways]
  ) displayedShapeTally -= 1
  props.reportModelInfo({ materialTally, shapeTally: displayedShapeTally })

  // Use `props.cameraPosition[2]` as a proxy for model size.
  const clusterSpacing = props.cameraPosition[2] * 0.7 // gap between clusters
  const modelSpacing = props.cameraPosition[2] * 0.03 // gap within a cluster
  
  // Calculate the central position of each cluster.
  const materialClusterCenters = Object.keys(meshesByMaterialName).reduce(
    (accumulator: { [key: string]: Vector3 }, key, i) => (
      {  ...accumulator,
        [key]: getClusterCenter(i, key, clusterSpacing, materialTally),
      }
    ), {}
  )
  const shapeClusterCenters = Object.keys(meshesByShapeName).reduce(
    (accumulator: Vector3[], key, i) => {
      accumulator[Number(key)] = getClusterCenter(i, key, clusterSpacing, shapeTally)
      return accumulator
    }, []
  )

  // Tell each Mesh its geometry's offsets from the original starting position.
  // First, overlapping at the exact center of the three cluster modes.
  interface UserDataGroup<T> {
    [ClusterMode.Material]: T,
    [ClusterMode.Original]: T,
    [ClusterMode.Shape]: T,
  }
  interface UserData {
    visible: UserDataGroup<boolean>
    materialName: string
    shapeName: ShapeName
    offset: UserDataGroup<Vector3>
  }
  meshes.value.forEach(mesh => {
    const child = mesh.children[0] // contains the geometry
    const data: UserData = mesh.userData
    const materialClusterCenter = materialClusterCenters[data.materialName]
    const shapeClusterCenter = shapeClusterCenters[Number(data.shapeName)]
    data.visible = { // eg hide apartment.glb's black lines
      [ClusterMode.Material]: data.materialName !== props.invisibleMaterialName,
      [ClusterMode.Original]: true,
      [ClusterMode.Shape]: data.materialName !== props.invisibleMaterialName,
    }
    data.offset = {
      [ClusterMode.Material]: getBoundingBoxOffset(materialClusterCenter, child),
      [ClusterMode.Original]: mesh.position.clone(), // always (0,0,0) in Apartment, but not Building
      [ClusterMode.Shape]: getBoundingBoxOffset(shapeClusterCenter, child),
    }
  })

  // Second, stop the Material cluster Meshes from overlapping.
  // The `invisibleMaterialName` prop is skipped, eg apartment.glb's black lines.
  //
  // Note that the fanning-out here is carefully tailored to the peculiarities
  // of apartment.glb and building.glb - a more complex system would be needed
  // to deal with a wider range of glTF models.
  Object.entries(meshesByShapeName).forEach(([ shapeName, meshes ]) => {
    const tally = meshes.length
    const rankCount = Math.floor(Math.sqrt(tally))
    const fileCount = Math.floor(tally / rankCount)
    meshes
      .filter(mesh => mesh.userData.materialName !== props.invisibleMaterialName)
      .forEach((mesh, i) => {
        const shape: Vector3 = mesh.userData.offset[ClusterMode.Shape]
        switch (Number(shapeName)) {
          case ShapeName.Block:
            const rank = i % rankCount
            const file = (i - rank) / fileCount
            shape.x += rank * modelSpacing * 4
            shape.y += file * modelSpacing * 4
            break
          case ShapeName.HorizontalPlane:
            shape.z += i * modelSpacing
            break
          case ShapeName.Pillar:
            shape.y += i * modelSpacing * 4
            break
          case ShapeName.BeamFacing:
          case ShapeName.PlaneLandscapeFacing:
          case ShapeName.PlaneLandscapeSideways:
          case ShapeName.PlanePortraitFacing:
          case ShapeName.PlanePortraitSideways:
          case ShapeName.PlaneSquareFacing:
          case ShapeName.PlaneSquareSideways:
            shape.y += i * modelSpacing
            break
          case ShapeName.BeamSideways:
            shape.x += i * modelSpacing
            break
        }
      }
    )
  })
}

</script>

<template>
  <main>
    <Renderer
      :antialias="true"
      :autoResize="true"
      :on-before-render="onAnimationFrame"
    >
      <PerspectiveCamera
        :position="cameraPosition"
        :up="[0, 1, 0]"
      >
        <OrbitControls />
      </PerspectiveCamera>

      <Scene :background="colorScheme === 'dark' ? '#333' : '#ccc'">
        <DirectionalLight :position="[30, 100, 100]" />
        <DirectionalLight :position="[-30, 100, -100]" />
        <GLTFLoader
          :position="modelPosition"
          :url="fixUrlForProd(modelUrl)"
          @load="onModelLoaded"
          ref="model"
        />
      </Scene>

    </Renderer>
  </main>
</template>

<style scoped>
main {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
}
</style>
