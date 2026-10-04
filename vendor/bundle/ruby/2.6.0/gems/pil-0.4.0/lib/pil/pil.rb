class Pil
  extend Forwardable

  def initialize
    @password_list = PasswordList.new
  end

  # ------------------------------ Class Methods ------------------------------

  def self.include?(password)
    Pil.new.include?(password)
  end

  def self.exclude?(password)
    !self.include?(password)
  end

  # ------------------------------ Instance Methods ------------------------------

  def_delegator :@password_list, :include?, :include?
  def_delegator :@password_list, :exclude?, :exclude?
end

