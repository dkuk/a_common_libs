module ACommonLibs
  module ACommonLibs
    class Hooks  < Redmine::Hook::ViewListener
      render_on(:view_layouts_base_html_head, partial: 'hooks/a_common_libs/html_head')
      render_on(:view_my_account, partial: 'hooks/a_common_libs/favourite_project')
      render_on(:view_users_form, partial: 'hooks/a_common_libs/favourite_project')
    end
  end
end
