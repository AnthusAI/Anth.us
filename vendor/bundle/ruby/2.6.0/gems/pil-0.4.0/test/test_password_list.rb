require 'test/unit'
require 'pil'

class PasswordListTest < Test::Unit::TestCase
  def setup
    @in_list      = 'peachy'
    @not_in_list  = 'notinlist'
  end

  def test_initialize
    assert_raise(RuntimeError) { Pil::PasswordList.new(nil) }
  end

  def test_passwords
    assert_respond_to(Pil::PasswordList.new.passwords, :count)
    assert_respond_to(Pil::PasswordList.new.passwords, :include?)
  end

  def test_include?
    assert_equal(true, Pil::PasswordList.new.include?(@in_list))
    assert_equal(false, Pil::PasswordList.new.include?(@not_in_list))
  end

  def test_exclude?
    assert_equal(false, Pil::PasswordList.new.exclude?(@in_list))
    assert_equal(true, Pil::PasswordList.new.exclude?(@not_in_list))
  end

  def test_count
    assert_equal(10000, Pil::PasswordList.new.count)
  end
end
