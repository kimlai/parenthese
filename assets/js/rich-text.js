import React from "react";

const RichText = ({ richText }) => {
  switch (richText.type) {
    case "text":
      return richText.content;
    case "bold":
      return (
        <span className="font-semibold">
          {richText.children.map(child => (
            <RichText richText={child} />
          ))}
        </span>
      );
    case "paragraph":
      return (
        <p>
          {richText.children.map(child => (
            <RichText richText={child} />
          ))}
        </p>
      );
    case "rich_text":
      return (
        <div>
          {richText.children.map(child => (
            <RichText richText={child} />
          ))}
        </div>
      );
  }
};

export default RichText;
