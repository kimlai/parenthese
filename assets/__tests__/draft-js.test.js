import { convertToRaw, convertFromHTML, ContentState } from "draft-js";

test("convertToRaw matches the format saved in our database", () => {
  const html = "héllo <b>world</b>"; // using é to have a unicode character

  const blocksFromHTML = convertFromHTML(html);
  const state = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );

  const rawContent = convertToRaw(state);

  expect(rawContent).toMatchSnapshot({
    blocks: [
      {
        key: expect.any(String)
      }
    ]
  });
});
