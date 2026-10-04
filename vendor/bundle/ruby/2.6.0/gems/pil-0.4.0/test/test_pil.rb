require 'test/unit'
require 'pil'

class PilTest < Test::Unit::TestCase
  def setup
    @in_list      = 'peachy'
    @not_in_list  = 'notinlist'
  end

  def test_self_include?
    assert_equal( true, Pil.include?(@in_list) )
    assert_equal( false, Pil.include?(@not_in_list) )
  end

  def test_self_exlude?
    assert_equal( false, Pil.exclude?(@in_list) )
    assert_equal( true, Pil.exclude?(@not_in_list) )
  end

  def test_include?
    assert_equal( true, Pil.new.include?(@in_list) )
    assert_equal( false, Pil.new.include?(@not_in_list) )
  end

  def text_exclude?
    assert_equal( false, Pil.new.exclude?(@in_list) )
    assert_equal( true, Pil.new.exclude?(@not_in_list) )
  end
end
