declare module "*.svg" {
  const src: string
  export default src
}

// Add this CSS declaration
declare module "*.css" {
  const content: string
  export default content
}

// Also good to add these if you use other CSS preprocessors
declare module "*.scss" {
  const content: string
  export default content
}

declare module "*.sass" {
  const content: string
  export default content
}

declare module "*.less" {
  const content: string
  export default content
}
