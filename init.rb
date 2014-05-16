Redmine::Plugin.register :a_common_libs do
  name 'A common libraries'
  author 'Danil Kukhlevskiy'
  description 'This is a plugin for including common libraries'
  version '0.0.1'
  url 'http://rmplus.pro/'
  author_url 'http://rmplus.pro/'

  settings :default => {'empty' => true}, :partial => 'settings/a_common_libs'
end

Rails.application.config.to_prepare do
  # ApplicationController.send(:include, ACommonLibs::ApplicationControllerPatch)
  ApplicationHelper.send(:include, ACommonLibs::ApplicationHelperPatch)
end

require 'a_common_libs/view_hooks'
