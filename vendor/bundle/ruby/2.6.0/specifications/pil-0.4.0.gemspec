# -*- encoding: utf-8 -*-
# stub: pil 0.4.0 ruby lib

Gem::Specification.new do |s|
  s.name = "pil".freeze
  s.version = "0.4.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Chris Cummer".freeze]
  s.date = "2018-01-30"
  s.description = "Checks a given plaintext password against an inclusion list of common passwords. Returns TRUE if the user's password is in the list; FALSE if it isn't.".freeze
  s.email = "chriscummer@me.com".freeze
  s.extra_rdoc_files = ["LICENSE.txt".freeze, "README.md".freeze]
  s.files = ["LICENSE.txt".freeze, "README.md".freeze]
  s.homepage = "http://github.com/senorprogrammer/pil".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "3.0.3.1".freeze
  s.summary = "The Password Inclusion List".freeze

  s.installed_by_version = "3.0.3.1" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<rdoc>.freeze, ["~> 6.0.1"])
      s.add_development_dependency(%q<bundler>.freeze, ["~> 1.16.1"])
      s.add_development_dependency(%q<jeweler>.freeze, ["~> 2.3.9"])
      s.add_development_dependency(%q<minitest>.freeze, ["~> 5.11.3"])
      s.add_development_dependency(%q<simplecov>.freeze, ["~> 0.15.1"])
      s.add_development_dependency(%q<test-unit>.freeze, ["~> 3.2.7"])
    else
      s.add_dependency(%q<rdoc>.freeze, ["~> 6.0.1"])
      s.add_dependency(%q<bundler>.freeze, ["~> 1.16.1"])
      s.add_dependency(%q<jeweler>.freeze, ["~> 2.3.9"])
      s.add_dependency(%q<minitest>.freeze, ["~> 5.11.3"])
      s.add_dependency(%q<simplecov>.freeze, ["~> 0.15.1"])
      s.add_dependency(%q<test-unit>.freeze, ["~> 3.2.7"])
    end
  else
    s.add_dependency(%q<rdoc>.freeze, ["~> 6.0.1"])
    s.add_dependency(%q<bundler>.freeze, ["~> 1.16.1"])
    s.add_dependency(%q<jeweler>.freeze, ["~> 2.3.9"])
    s.add_dependency(%q<minitest>.freeze, ["~> 5.11.3"])
    s.add_dependency(%q<simplecov>.freeze, ["~> 0.15.1"])
    s.add_dependency(%q<test-unit>.freeze, ["~> 3.2.7"])
  end
end
