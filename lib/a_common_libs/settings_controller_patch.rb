module ACommonLibs
  module SettingsControllerPatch

    def self.included(base)

      base.extend(ClassMethods)
      base.send(:include, InstanceMethods)

      base.class_eval do
        alias_method_chain :plugin, :a_common_libs
        helper :cl_settings_page
      end
    end

    module ClassMethods
    end

    module InstanceMethods
      def plugin_with_a_common_libs
        if request.post?
          if params[:settings].nil? || params[:settings] == ''
            params[:settings] = HashWithIndifferentAccess.new
          end
        end
        plugin_without_a_common_libs
      end
    end

  end
end