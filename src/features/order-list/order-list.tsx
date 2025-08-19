import { FC, useState } from 'react'
import { Card } from 'common/ui/card'
import { Tabs } from 'common/ui/tabs'

const OrderList: FC = () => {
  const [activeOrderListTab, setActiveOrderListTab] = useState<
    'open-orders' | 'order-history' | 'trade-history' | 'funds' | 'bots'
  >('open-orders')

  return (
    <>
      <Card className="w-full h-full relative md:border-r border-border-color">
        <Card.Header className=" px-4">
          <div className="flex justify-between items-center">
            <Tabs defaultActiveId={activeOrderListTab} className="">
              <Tabs.Header className="!border-b-0 w-full flex gap-5">
                <Tabs.Trigger
                  value="open-orders"
                  label="Open Orders"
                  onClick={() => setActiveOrderListTab('open-orders')}
                />
                {/* <Tabs.Trigger
                  value="order-history"
                  label="Order History"
                  onClick={() => setActiveOrderListTab('order-history')}
                />
                <Tabs.Trigger
                  value="trade-history"
                  label="Trade History"
                  onClick={() => setActiveOrderListTab('trade-history')}
                /> */}

                <>
                  <Tabs.Trigger
                    value="funds"
                    label="Funds"
                    onClick={() => setActiveOrderListTab('funds')}
                  />
                  <Tabs.Trigger
                    value="bots"
                    label="Bots"
                    onClick={() => setActiveOrderListTab('bots')}
                  />
                </>
              </Tabs.Header>
            </Tabs>
            <Card.Actions>
              <div className="" />
            </Card.Actions>
          </div>
        </Card.Header>
        <Card.Actions>
          <div className="" />
        </Card.Actions>
        <Card.Content>
          <div className="text-base text-accent-primary font-semibold h-90 w-full flex justify-center items-center">
            Soon...
          </div>
        </Card.Content>
      </Card>
    </>
  )
}

export { OrderList }
