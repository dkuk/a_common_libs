module ACommonLibs
  module ACommonLibs
    class Hooks  < Redmine::Hook::ViewListener
      render_on(:view_layouts_base_html_head, :partial => "hooks/a_common_libs/html_head")
    end
  end
end
