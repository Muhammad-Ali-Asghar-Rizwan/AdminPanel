export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-06'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token= assertValue(
 " sknapZCowQ99VL6w1EVFl4YxvUQO9hSoZy8uCYoZNCXhT000rWMt3tftS1kk6YGNzAiz42EVtXEDvejGOajCuGtqJSr3QQRaRqqlG4l7ywgwntqlvMgmqRl1Kurg2Ufti6u3qSDmlBYNFMXHzZ6X1mZ6ZXLWTgudRq0N4hGQo4DapZ4Gpc1I",
  'Missing environment variable: NEXT_PUBLIC_SANITY_Token'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
