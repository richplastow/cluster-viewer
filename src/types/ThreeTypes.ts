import { GLTFLoader, Mesh } from '@janvorisek/drie'

// /** A 3D vector, often a coordinate, with `x`, `y`, and `z` properties. */
// export type Coordinate = { x:number, y:number, z:number }

// /** An axis-aligned bounding box in 3D space, with `min` and `max` Vector3s. */
// export type BoundingBox = { min:Coordinate, max:Coordinate }

/** The Drie `GLTFLoader` type. */
export type GLTFLoader = typeof GLTFLoader

/** A 3x1 matrix, typically used for position or rotation. */
export type Matrix3 = [ number, number, number ]

/** The Drie Object3D `Mesh` type. */
export type Mesh = typeof Mesh

