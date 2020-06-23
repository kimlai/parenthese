defmodule ParentheseWeb.PageView do
  use ParentheseWeb, :view
  import Phoenix.HTML.Tag

  def navbar_item(assigns) do
    render("navbar_item.html", Keyword.put_new(assigns, :data, []))
  end

  def category_filter(text, category, assigns) do
    active_class =
      if assigns[:active] == true do
        ["active"]
      else
        []
      end

    class = ["category-filter", "uppercase", "hover:text-orange-500"] ++ active_class

    ~E"""
    <li
      class="<%= Enum.join(class, " ") %>"
    >
    <a
      data-category="<%= category %>"
      data-ignore-navigation
      href="<%= Routes.page_path(assigns.conn, :index, category: category) %>"
    >
        <%= text %>
      </a>
    </li>
    """
  end

  def cube(x, y, width, content \\ "") do
    content_tag(:div,
      class: "cube hidden",
      style:
        styles(
          bottom: "#{x * width * 0.68 + y * width * 1.1 + width * 2}px",
          left: "#{x * width}px",
          width: "#{width}px",
          height: "#{width}px"
        )
    ) do
      [
        raw(content),
        content_tag(
          :div,
          "",
          class: "cube-top",
          style:
            styles(
              left: "#{width}px",
              width: "#{width}px",
              height: "#{width}px"
            )
        ),
        content_tag(
          :div,
          "",
          class: "cube-right",
          style:
            styles(
              left: "#{width}px",
              width: "#{width}px",
              height: "#{width}px"
            )
        )
      ]
    end
  end

  defp styles(styles) do
    Enum.map_join(styles, ";", fn {k, v} -> "#{k}:#{v}" end)
  end
end
