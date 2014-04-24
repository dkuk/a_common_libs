include ModalWindowsHelper

module ACommonLibs
  module ApplicationHelperPatch

    def self.included(base)

      base.extend(ClassMethods)
      base.send(:include, InstanceMethods)

      base.class_eval do
      end
    end

    module InstanceMethods
    end

    module ClassMethods
    end

  end
end