# -*- encoding: utf-8 -*-
# stub: filewatcher 1.1.1 ruby lib

Gem::Specification.new do |s|
  s.name = "filewatcher".freeze
  s.version = "1.1.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Thomas Flemming".freeze]
  s.date = "2018-09-11"
  s.description = "Detect changes in filesystem. Works anywhere.".freeze
  s.email = ["thomas.flemming@gmail.com".freeze]
  s.executables = ["filewatcher".freeze]
  s.files = ["bin/filewatcher".freeze]
  s.homepage = "http://github.com/thomasfl/filewatcher".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "3.0.3.1".freeze
  s.summary = "Lighweight filewatcher.".freeze

  s.installed_by_version = "3.0.3.1" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<bacon>.freeze, ["~> 1.2"])
      s.add_runtime_dependency(%q<optimist>.freeze, ["~> 3.0"])
      s.add_development_dependency(%q<rake>.freeze, ["~> 12.0"])
      s.add_development_dependency(%q<rubocop>.freeze, ["~> 0.57"])
    else
      s.add_dependency(%q<bacon>.freeze, ["~> 1.2"])
      s.add_dependency(%q<optimist>.freeze, ["~> 3.0"])
      s.add_dependency(%q<rake>.freeze, ["~> 12.0"])
      s.add_dependency(%q<rubocop>.freeze, ["~> 0.57"])
    end
  else
    s.add_dependency(%q<bacon>.freeze, ["~> 1.2"])
    s.add_dependency(%q<optimist>.freeze, ["~> 3.0"])
    s.add_dependency(%q<rake>.freeze, ["~> 12.0"])
    s.add_dependency(%q<rubocop>.freeze, ["~> 0.57"])
  end
end
