# PIL: Password Inclusion List

PIL is a gem for determining whether or not a given word is amongst the
10,000 most commonly-used passwords as defined by Mark Burnett's [10,000 Top
Passwords](http://xato.net/passwords/more-top-worst-passwords/).

## Installation

You can let bundler install PIL by adding this line to your application's Gemfile:

    gem 'pil'

And then execute:

    bundle install

Or install it yourself with:

    gem install pil

## Usage

### Password Inclusion

To determine if the password IS in the common list.

PIL returns FALSE if a given password cannot be found in its common
password list; TRUE if the password is found and thus is commonly-used:

    Pil.include?( 'good!password?' )  # => false
    Pil.include?( 'password' )        # => true

### Password Exclusion

To determine if the password IS NOT in the common list.

PIL returns TRUE if a given password cannot be found its common password
list; FALSE if the password is found and thus is commonly-used:

    Pil.exclude?( 'good!password?' )  # => true
    Pil.exclude?( 'password' )        # => false

### Instantiation

You can also instantiate PIL:

    pil = Pil.new
    pil.include?( 'areallylongpasswordwithathreeatheend3' )   # => false
    pil.exclude?( 'areallylongpasswordwithathreeatheend3' )   # => true

## With Rails

In your User model:

    validates :password, uncommon: true

If you prefer your own error message (ie: for localization):

    validates :password, uncommon: { error_message: "Password is too common." }

In /app/validators/ create a new class called UncommonValidator:

    class UncommonValidator < ActiveModel::EachValidator
      def validate_each(object, attribute, value)
        if Pil.include?(value)
          object.errors[attribute] << (options[:error_message] || "Password is commonly used. Please choose a different password.")
        end
      end
    end

## Contributing to PIL

* Check out the latest master to make sure the feature hasn't been implemented or the bug hasn't been fixed yet.
* Check out the issue tracker to make sure someone already hasn't requested it and/or contributed it.
* Fork the project.
* Start a feature/bugfix branch.
* Commit and push until you are happy with your contribution.
* Make sure to add tests for it. This is important so I don't break it in a future version unintentionally.
* Please try not to mess with the Rakefile, version, or history. If you want to have your own version, or is otherwise necessary, that is fine, but please isolate to its own commit so I can cherry-pick around it.

## Copyright

Copyright (c) 2012 Chris Cummer. See LICENSE.txt for
further details.

