defmodule ParentheseWeb.PublicationControllerTest do
  use ParentheseWeb.ConnCase

  alias Parenthese.Publications

  @create_attrs %{date: "some date", journal: "some journal", project: "some project", title: "some title", url: "some url"}
  @update_attrs %{date: "some updated date", journal: "some updated journal", project: "some updated project", title: "some updated title", url: "some updated url"}
  @invalid_attrs %{date: nil, journal: nil, project: nil, title: nil, url: nil}

  def fixture(:publication) do
    {:ok, publication} = Publications.create_publication(@create_attrs)
    publication
  end

  describe "index" do
    test "lists all publications", %{conn: conn} do
      conn = get(conn, Routes.publication_path(conn, :index))
      assert html_response(conn, 200) =~ "Listing Publications"
    end
  end

  describe "new publication" do
    test "renders form", %{conn: conn} do
      conn = get(conn, Routes.publication_path(conn, :new))
      assert html_response(conn, 200) =~ "New Publication"
    end
  end

  describe "create publication" do
    test "redirects to show when data is valid", %{conn: conn} do
      conn = post(conn, Routes.publication_path(conn, :create), publication: @create_attrs)

      assert %{id: id} = redirected_params(conn)
      assert redirected_to(conn) == Routes.publication_path(conn, :show, id)

      conn = get(conn, Routes.publication_path(conn, :show, id))
      assert html_response(conn, 200) =~ "Show Publication"
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.publication_path(conn, :create), publication: @invalid_attrs)
      assert html_response(conn, 200) =~ "New Publication"
    end
  end

  describe "edit publication" do
    setup [:create_publication]

    test "renders form for editing chosen publication", %{conn: conn, publication: publication} do
      conn = get(conn, Routes.publication_path(conn, :edit, publication))
      assert html_response(conn, 200) =~ "Edit Publication"
    end
  end

  describe "update publication" do
    setup [:create_publication]

    test "redirects when data is valid", %{conn: conn, publication: publication} do
      conn = put(conn, Routes.publication_path(conn, :update, publication), publication: @update_attrs)
      assert redirected_to(conn) == Routes.publication_path(conn, :show, publication)

      conn = get(conn, Routes.publication_path(conn, :show, publication))
      assert html_response(conn, 200) =~ "some updated date"
    end

    test "renders errors when data is invalid", %{conn: conn, publication: publication} do
      conn = put(conn, Routes.publication_path(conn, :update, publication), publication: @invalid_attrs)
      assert html_response(conn, 200) =~ "Edit Publication"
    end
  end

  describe "delete publication" do
    setup [:create_publication]

    test "deletes chosen publication", %{conn: conn, publication: publication} do
      conn = delete(conn, Routes.publication_path(conn, :delete, publication))
      assert redirected_to(conn) == Routes.publication_path(conn, :index)
      assert_error_sent 404, fn ->
        get(conn, Routes.publication_path(conn, :show, publication))
      end
    end
  end

  defp create_publication(_) do
    publication = fixture(:publication)
    {:ok, publication: publication}
  end
end