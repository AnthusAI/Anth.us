require 'set'

class Pil::PasswordList
  extend Forwardable

  attr_reader :passwords

  DEFAULT_PASSWORD_FILE = File.expand_path('../../data/passwords.txt', __FILE__)

  # ------------------------------ Instance Methods ------------------------------

  def_delegator :@passwords, :count, :count
  def_delegator :@passwords, :include?, :include?

  def initialize(datafile = DEFAULT_PASSWORD_FILE)
    load_passwords(datafile)
  end

  def exclude?(password)
    !include?(password)
  end

  private

    def load_passwords(datafile)
      raise "Password list cannot be nil" if datafile.nil?
      File.open(datafile) { |file| @passwords = Set.new(file.readlines.each(&:chop!)) }
    end
end
