defmodule ParentheseWeb.ProjectViewTest do
  use ExUnit.Case, async: true
  import Phoenix.HTML
  import ParentheseWeb.ProjectView

  describe "rich text" do
    test "render_block/2 applies some style to some text" do
      block = %{
        "text" => "hello",
        "inlineStyleRanges" => [%{"offset" => 1, "length" => 2, "style" => "BOLD"}]
      }

      assert safe_to_string(render_block(block)) ==
               ~s(<p>h<span class="font-semibold">el</span>lo</p>)
    end

    test "render_block/2 applies multiple styles to some text" do
      block = %{
        "text" => "hello, world",
        "inlineStyleRanges" => [
          %{"offset" => 1, "length" => 2, "style" => "BOLD"},
          %{"offset" => 4, "length" => 1, "style" => "BOLD"}
        ]
      }

      assert safe_to_string(render_block(block)) ==
               ~s(<p>h<span class="font-semibold">el</span>l<span class="font-semibold">o</span>, world</p>)
    end

    test "render_block/2 can handle multiple codepoints characters" do
      block = %{
        "text" => "éa",
        "inlineStyleRanges" => [
          # offset 2 because é is 2 codepoints (["e", "́"])
          %{"offset" => 2, "length" => 1, "style" => "BOLD"}
        ]
      }

      assert safe_to_string(render_block(block)) ==
               ~s(<p>é<span class="font-semibold">a</span></p>)
    end
  end
end
