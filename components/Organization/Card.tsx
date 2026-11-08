import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardProps,
  CardText,
  CardTitle,
  Icon,
  Image,
} from 'idea-react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { BadgeBar } from 'mobx-restful-table';
import { HTMLAttributes } from 'react';

import { Organization } from '../../models/Organization';
import { i18n, I18nContext } from '../../models/Translation';

export interface OrganizationCardProps
  extends
    Pick<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>,
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
          <Button title="E-mail" size="sm" theme="warning" href={`mailto:${email}`}>
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
            theme="success"
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
        {/* <CardImage
          placement="top"
          className="object-fit-contain"
          style={{ height: '30vh' }}
          src={logos}
        /> */}
        <CardBody>
          <CardTitle>
            {name + ''}
            <BadgeBar className="ms-3" list={[{ text: entityType + '' }]} />
          </CardTitle>

          {services && (
            <BadgeBar
              className="justify-content-end"
              list={(services as string[]).map(text => ({ text }))}
            />
          )}
          <CardText
            className="d-none sm:d-block text-wrap overflow-auto"
            style={{ minHeight: '5rem', maxHeight: '10rem' }}
          >
            {description?.toString()}
          </CardText>
        </CardBody>

        <CardFooter>
          {this.renderIcon()}

          {this.showQRC && (
            <Image
              className="mt-3"
              src={`https://open.weixin.qq.com/qr/code?username=${wechatPublic}`}
              alt={wechatPublic?.toString()}
              fluid
            />
          )}
        </CardFooter>
      </Card>
    );
  }
}
