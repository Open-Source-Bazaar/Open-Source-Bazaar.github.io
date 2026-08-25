import { Icon } from 'idea-react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { BadgeBar } from 'mobx-restful-table';
import { HTMLAttributes } from 'react';
import { Button, Card, CardProps, Image } from 'react-bootstrap';

import { i18n, I18nContext } from '../../models/Translation';
import { Organization } from '../../models/Organization';

export interface OrganizationCardProps
  extends Pick<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>,
    Omit<Organization, 'id'>,
    CardProps {
  onSwitch?: (filter: Partial<Pick<Organization, 'entityType' | 'coverageArea'>>) => any;
}

@observer
export class OrganizationCard extends ObservedComponent<OrganizationCardProps, typeof i18n> {
  static contextType = I18nContext;

  @observable
  accessor showQRC = false;

  renderIcon() {
    const { website, wechatPublic } = this.observedProps;

    return (
      <div className="d-flex justify-content-around">
        {/* {email && (
          <Button title="E-mail" size="sm" variant="warning" href={`mailto:${email}`}>
            <Icon name="mailbox2" />
          </Button>
        )} */}
        {website && (
          <Button title="WWW" size="sm" target="_blank" href={website?.toString()}>
            <Icon name="globe2" />
          </Button>
        )}
        {wechatPublic && (
          <Button
            title="WeChat"
            size="sm"
            variant="success"
            onClick={() => (this.showQRC = !this.showQRC)}
          >
            <Icon name="chat-fill" />
          </Button>
        )}
      </div>
    );
  }

  render() {
    const { name, entityType, services, description, wechatPublic, onSwitch, ...props } =
      this.props;

    return (
      <Card
        {...props}
        style={{
          ...props.style,
          contentVisibility: 'auto',
          containIntrinsicHeight: '36rem',
        }}
      >
        {/* <Card.Img
          variant="top"
          className="object-fit-contain"
          style={{ height: '30vh' }}
          src={logos}
        /> */}
        <Card.Body>
          <Card.Title>
            {name + ''}
            <BadgeBar className="ms-2" list={[{ text: entityType + '' }]} />
          </Card.Title>

          {services && (
            <BadgeBar
              className="justify-content-end"
              list={(services as string[]).map(text => ({ text }))}
            />
          )}
          <Card.Text
            className="d-none d-sm-block text-wrap overflow-auto"
            style={{ minHeight: '5rem', maxHeight: '10rem' }}
          >
            {description?.toString()}
          </Card.Text>
        </Card.Body>

        <Card.Footer>
          {this.renderIcon()}

          {this.showQRC && (
            <Image
              className="mt-2"
              src={`https://open.weixin.qq.com/qr/code?username=${wechatPublic}`}
              alt={wechatPublic?.toString()}
              fluid
            />
          )}
        </Card.Footer>
      </Card>
    );
  }
}
