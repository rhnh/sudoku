import {describe, it, expect} from "vitest"
import {keys} from "../src/utils"

describe("keys", () => {
  it("should have all keys", () => {
    expect(keys.find((r) => r === "a1")).toBe("a1")
    expect(keys.find((r) => r === "a2")).toBe("a2")
  })
})
