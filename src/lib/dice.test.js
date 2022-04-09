import { roll } from "./dice";
// yeah, this test won't really work until you mock lodash random :P
describe("roll", () => {
  it("should work", () => {
    expect(roll("10d4")).toBe(1);
  });
});
