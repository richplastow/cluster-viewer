import { GLTFLoader, PerspectiveCamera, Mesh } from '@janvorisek/drie'

/** The Drie `GLTFLoader` type. */
export type GLTFLoader = typeof GLTFLoader

/** A 3x1 matrix, typically used for position or rotation. */
export type Matrix3 = [ number, number, number ]

/** The Drie Object3D `Mesh` type. */
export type Mesh = typeof Mesh

/** A dictionary where values are arrays of Meshes. */
export type MeshArrayDict = { [key: string]: Mesh[] }

/** The Drie Object3D `PerspectiveCamera` type. */
export type PerspectiveCamera = typeof PerspectiveCamera
