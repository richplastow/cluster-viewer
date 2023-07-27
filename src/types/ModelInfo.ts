/** Metadata gathered from a glTF model, displayed by an InfoBox. */
export default interface ModelInfo {
  /** The number of distinct colours in the model. */
  colourTally: number
  /** The number of shapes in the model, where a shape is determined
   *  by the geometry's bounding box. */
  shapeTally: number
}
