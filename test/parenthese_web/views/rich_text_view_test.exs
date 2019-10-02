defmodule ParentheseWeb.RichTextViewTest do
  use ExUnit.Case, async: true
  import Phoenix.HTML
  import ParentheseWeb.RichTextView

  describe "rich text" do
    test "to_html/1 renders HTML from draft-js JSON" do
      json =
        Jason.encode!(%{
          blocks: [
            %{
              text: "hello",
              inlineStyleRanges: [%{"offset" => 1, "length" => 2, "style" => "BOLD"}]
            }
          ]
        })

      assert safe_to_string(to_html(json)) ==
               ~s(<div><p>h<span class="font-semibold">el</span>lo</p></div>)
    end

    test "to_html/1 can apply multiple inline styles to the same text" do
      json =
        Jason.encode!(%{
          blocks: [
            %{
              text: "hello, world",
              inlineStyleRanges: [
                %{"offset" => 1, "length" => 2, "style" => "BOLD"},
                %{"offset" => 4, "length" => 1, "style" => "BOLD"}
              ]
            }
          ]
        })

      assert safe_to_string(to_html(json)) ==
               ~s(<div><p>h<span class="font-semibold">el</span>l<span class="font-semibold">o</span>, world</p></div>)
    end

    test "to_html/1 can handle multiple codepoints characters" do
      json =
        Jason.encode!(%{
          blocks: [
            %{
              text: "éa",
              inlineStyleRanges: [
                # offset 2 because é is 2 codepoints (["e", "́"])
                %{"offset" => 2, "length" => 1, "style" => "BOLD"}
              ]
            }
          ]
        })

      assert safe_to_string(to_html(json)) ==
               ~s(<div><p>é<span class="font-semibold">a</span></p></div>)
    end
  end
end
