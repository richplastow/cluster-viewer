/** Defines how the model should currently be clustered. */
enum ShapeName {
  /** A shape whose width is much greater than its height or depth. */
  BeamFacing,
  /** A shape whose depth is much greater than its width or height. */
  BeamSideways,
  /** Doesn't conform to any of the other shapes, so must be somewhat boxy. */
  Block,
  /** A horizontal plane, like a floor or ceiling. */
  HorizontalPlane,
  /** A shape whose height is very much greater than its width or depth. */
  Pillar,
  /** A vertical plane, like a wall, which extends in the 'width' direction,
   *  wider than it is tall. */
  PlaneLandscapeFacing,
  /** A vertical plane, like a wall, which extends in the 'depth' direction,
   *  deeper than it is tall. */
  PlaneLandscapeSideways,
  /** A vertical plane, like a wall, which extends in the 'width' direction,
   *  taller than it is wide. */
  PlanePortraitFacing,
  /** A vertical plane, like a wall, which extends in the 'depth' direction,
   *  taller than it is deep. */
  PlanePortraitSideways,
  /** A vertical plane, like a wall, which extends in the 'width' direction,
   *  roughly the same height and width. */
  PlaneSquareFacing,
  /** A vertical plane, like a wall, which extends in the 'depth' direction,
   *  roughly the same height and depth. */
  PlaneSquareSideways,
  /** Provides a value of the ShapeName type for Object3Ds with no geometry. */
  Unknown,
}

export default ShapeName
