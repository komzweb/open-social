export interface SearchParams {
  [key: string]: string | string[] | undefined
}

export interface FieldErrors {
  [key: string]: string[]
}

export type PrevState =
  | {
      success: boolean
      message?: string
      fieldErrors?: FieldErrors
    }
  | undefined
