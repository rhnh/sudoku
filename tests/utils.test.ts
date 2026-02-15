import {test, describe, expect} from "vitest"
import {positionToKey, getSquareNr} from "../src/utils"

describe("PositionToKey", () => {
  test("positionToKey should return proper key", () => {
    expect(positionToKey([0, 0])).toBe("a11")
    expect(positionToKey([0, 1])).toBe("a21")
  })
})

// describe("PositionToKey", () => {
//   test("positionToKey should return proper key", () => {
//     expect(getSquareNr(1)).toEqual([1, 1])
//     expect(getSquareNr(2)).toEqual([1, 2])
//     expect(getSquareNr(2)).toEqual([1, 3])

//     // expect(getSquareNr(3)).toEqual([2, 3])
//     // expect(getSquareNr(4)).toEqual([2, 1])
//     // expect(getSquareNr(5)).toEqual([2, 2])

//     // expect(getSquareNr(6)).toEqual([3, 0])
//     // expect(getSquareNr(7)).toEqual([3, 1])
//     // expect(getSquareNr(8)).toEqual([3, 2])
//   })
// })
