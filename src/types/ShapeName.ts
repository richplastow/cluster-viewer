/** Defines how the model should currently be clustered. */
enum ShapeName {
  /** A shape whose width is much greater than its height or depth. */
  BeamFacing,
  /** A shape whose depth is much greater than its width or height. */
  BeamSideways,
  /** Doesn't conform to any of the other shapes, so must be somewhat boxy. */
  Block,
  /** A shape whose height is much greater than its width or depth. */
  Pillar,
  /** A horizontal plane, like a floor or ceiling. */
  HorizontalPlane,
  /** Provides a shape category when an Object3D has no geometry. */
  Unknown,
  /** A vertical plane, like a wall, which extends in the x direction. */
  VerticalPlaneFacing,
  /** A vertical plane, like a wall, which extends in the z direction. */
  VerticalPlaneSideways,
}

export default ShapeName
