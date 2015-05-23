# coding: utf-8

module Jiji::Test::Mock

  class MockSecurities

    include Jiji::Errors
    include Jiji::Model::Trading

    attr :config

    def initialize( config )
      @config = config
    end

    def destroy
    end

    def retrieve_pairs
      [
        Pair.new(:EURJPY, "EUR_JPY", 0.01,   10000000),
        Pair.new(:EURUSD, "EUR_USD", 0.0001, 10000000),
        Pair.new(:USDJPY, "USD_JPY", 0.01,   10000000)
      ]
    end

    def retrieve_current_ticks

    end

    def order(_pair, sell_or_buy, count)
    end

    def commit(_position_id, count)
    end


    def self.register_securities_to( factory )
      factory.register_securities(:MOCK, 'モック', [], self)
    end

  end

end