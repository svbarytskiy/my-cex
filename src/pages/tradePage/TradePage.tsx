import { HorizontalScrollContainer } from 'common/components/HorizontalScrollContainer/HorizontalScrollContainer'
import { useDeviceType } from 'common/hooks/useDeviceType'
import { Card } from 'common/ui/card'
import { Tabs } from 'common/ui/tabs'

import { LastTrades } from 'features/last-trades'
import { MarketInfo } from 'features/market-info'
import { OrderBook, OrderBookCardAction } from 'features/order-book'
import { OrderList } from 'features/order-list'
import { TradePanel } from 'features/trade-panel'
import { TradingView } from 'features/trading-view'
import { useState } from 'react'

const TradePage = () => {
  const [activeChartTab, setActiveChartTab] = useState<
    'chart' | 'info' | 'trading-data' | 'order-book' | 'last-trades'
  >('chart')
  const [activeBookTab, setActiveBookTab] = useState<
    'order-book' | 'last-trades'
  >('order-book')
  const { isMobile, isTablet, isDesktop } = useDeviceType()
  return (
    <>
      <div className="trading-page">
        <MarketInfo />
        <div className="trading-content-wrapper">
          <div className="trading-main">
            <div className="chart-area">
              <div className="chart-container h-150">
                <Card className="w-full h-full relative">
                  <Card.Header className=" px-4">
                    <div className="flex justify-between items-center max-w-full">
                      <HorizontalScrollContainer>
                        <Tabs
                          defaultActiveId={activeChartTab}
                          className="max-w-full"
                        >
                          <Tabs.Header className="!border-b-0 w-full flex gap-3 md:gap-4">
                            <Tabs.Trigger
                              value="chart"
                              label="Chart"
                              onClick={() => setActiveChartTab('chart')}
                            />
                            {/* <Tabs.Trigger
                              value="info"
                              label="Info"
                              onClick={() => setActiveChartTab('info')}
                            />
                            <Tabs.Trigger
                              value="trading-data"
                              label="Trading Data"
                              onClick={() => setActiveChartTab('trading-data')}
                            /> */}
                            {isMobile && (
                              <>
                                <Tabs.Trigger
                                  value="order-book"
                                  label="Order Book"
                                  onClick={() =>
                                    setActiveChartTab('order-book')
                                  }
                                />
                                <Tabs.Trigger
                                  value="last-trades"
                                  label="Last Trades"
                                  onClick={() =>
                                    setActiveChartTab('last-trades')
                                  }
                                />
                              </>
                            )}
                          </Tabs.Header>
                        </Tabs>
                      </HorizontalScrollContainer>

                      <Card.Actions>
                        <div className="" />
                      </Card.Actions>
                    </div>
                  </Card.Header>
                  <Card.Actions>
                    <div className="" />
                  </Card.Actions>
                  <Card.Content>
                    {activeChartTab === 'chart' && <TradingView />}
                    {activeChartTab === 'info' && (
                      <div className="m-auto">Info</div>
                    )}
                    {activeChartTab === 'trading-data' && (
                      <div className="m-auto">trading-data</div>
                    )}
                    {activeChartTab === 'order-book' && <OrderBook />}
                    {activeChartTab === 'last-trades' && <LastTrades />}
                  </Card.Content>
                </Card>
              </div>
              {isDesktop && (
                <div className="order-book-container">
                  <Card className="w-full h-full relative">
                    <Card.Header className="px-4">
                      <div className="flex justify-between items-center">
                        <Tabs defaultActiveId={activeChartTab} className="">
                          <Tabs.Header className="!border-b-0 w-full flex gap-5">
                            <Tabs.Trigger
                              value="order-book"
                              label="Order Book"
                              onClick={() => setActiveBookTab('order-book')}
                            />
                            <Tabs.Trigger
                              value="last-trades"
                              label="Last Trades"
                              onClick={() => setActiveBookTab('last-trades')}
                            />
                          </Tabs.Header>
                        </Tabs>
                        <Card.Actions>
                          {activeBookTab === 'order-book' && (
                            <OrderBookCardAction />
                          )}
                        </Card.Actions>
                      </div>
                    </Card.Header>
                    <Card.Actions>
                      <div className="" />
                    </Card.Actions>
                    <Card.Content>
                      {activeBookTab === 'order-book' && <OrderBook />}
                      {activeBookTab === 'last-trades' && <LastTrades />}
                    </Card.Content>
                  </Card>
                </div>
              )}
              {isTablet && (
                <div className="order-book-container">
                  <Card className="w-full h-full relative  border border-border-color">
                    <Card.Header className="px-4 h-10">
                      <div className="flex justify-between items-center h-full">
                        <h1 className="text-text-primary text-base">
                          Last Trades
                        </h1>
                      </div>
                    </Card.Header>
                    <Card.Actions>
                      <div className="" />
                    </Card.Actions>
                    <Card.Content>
                      <LastTrades />
                    </Card.Content>
                  </Card>
                  <Card className="w-full h-full relative border border-border-color">
                    <Card.Header className="px-4">
                      <div className="flex justify-between items-center">
                        <h1 className="text-text-primary text-base">
                          Order Book
                        </h1>
                        <Card.Actions>
                          <OrderBookCardAction />
                        </Card.Actions>
                      </div>
                    </Card.Header>
                    <Card.Actions>
                      <div className="" />
                    </Card.Actions>
                    <Card.Content>
                      <OrderBook />
                    </Card.Content>
                  </Card>
                </div>
              )}
            </div>

            <div className="order-list-container">
              <OrderList />
            </div>
          </div>

          <div className="trading-sidebar">
            <TradePanel />
          </div>
        </div>
      </div>
    </>
  )
}
export { TradePage }
