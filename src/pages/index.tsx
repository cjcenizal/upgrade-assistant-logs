import React from 'react';
import moment from 'moment';

import {
  EuiButton,
  EuiCode,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiText,
  EuiPanel,
  EuiTitle,
  EuiFlexGroup,
  EuiFlexItem,
  EuiAccordion,
  EuiIcon,
  EuiLink,
  EuiSpacer,
  EuiHorizontalRule,
  EuiIconTip,
  EuiDescriptionList,
  EuiBadge,
} from '@elastic/eui';

import {
  EUI_CHARTS_THEME_DARK,
  EUI_CHARTS_THEME_LIGHT,
} from '@elastic/eui/dist/eui_charts_theme';

import '@elastic/charts/dist/theme_only_light.css';

import {
  Chart,
  Settings,
  Axis,
  LineSeries,
  BarSeries,
  DataGenerator,
} from '@elastic/charts';

const CRITICAL = 'Critical';
const WARNING = 'Warning';

const deprecations = [{
  isFixed: true,
  level: CRITICAL,
  category: 'Index access',
  title: 'Access system indices via specific APIs',
  message: 'This request accesses system indices: [.apm-agent-configuration, .apm-custom-link, .kibana_1, .kibana_task_manager_1, .security-7], but in a future major version, direct access to system indices will be prevented by default',
}, {
  isFixed: false,
  level: CRITICAL,
  category: 'Index access',
  title: 'Access system indices via specific APIs',
  message: 'This request accesses system indices: [.apm-agent-configuration, .apm-custom-link, .kibana_1, .kibana_task_manager_1, .security-7], but in a future major version, direct access to system indices will be prevented by default',
}];

const generateData = () => {
  const data = [];
  const types = ['Deprecation', 'Success'];
  const days = 14;

  for (let day = 0; day < days; day++) {
    types.forEach(type => {
      const count = Math.floor(Math.random() * 200);
      data.unshift({
        x: moment().subtract(day, 'days').format('MMM DD'),
        y: count,
        g: type,
      });
    });
  }

  return data;
};

const DeprecationLogTitle = ({ isFixed, level, title, category }) => (
  <EuiFlexGroup alignItems="center" gutterSize="m">
    <EuiFlexItem grow={false}>
      {isFixed ? (
        <EuiIconTip
          aria-label="Success"
          type="checkInCircleFilled"
          color="success"
          content="Recent logs contain no deprecations"
        />
      ) : (
        <EuiIconTip
          aria-label="Warning"
          type="alert"
          color="warning"
          content="Recent logs contain deprecations"
        />
      )}
    </EuiFlexItem>

    <EuiFlexItem grow={false}>
      {level === CRITICAL ? (
        <EuiBadge color={isFixed ? 'default' : 'danger'}>{level}</EuiBadge>
      ) : (
        <EuiBadge color={isFixed ? 'default' : 'warning'}>{level}</EuiBadge>
      )}
    </EuiFlexItem>

    <EuiFlexItem grow={false}>
      <strong>{category}</strong>
    </EuiFlexItem>

    <EuiFlexItem grow={false}>
      {title}
    </EuiFlexItem>
  </EuiFlexGroup>
);

const DeprecationLogActions = () => <EuiLink>Hide</EuiLink>;

const DeprecationLog = ({ id, deprecation: { isFixed, level, title, category, message } }) => {
  const data = generateData();

  return (
    <EuiFlexItem>
      <EuiPanel paddingSize="s">
        <EuiAccordion
          id={id.toString()}
          buttonContent={<DeprecationLogTitle isFixed={isFixed} level={level} title={title} category={category} />}
          extraAction={<DeprecationLogActions />}
          paddingSize="s"
        >
          <EuiSpacer size="s" />

          <Chart size={{ height: 200 }}>
            <Settings theme={EUI_CHARTS_THEME_LIGHT.theme} showLegend={false} />
            <BarSeries
              id="status"
              name="Status"
              data={data}
              xAccessor={'x'}
              yAccessors={['y']}
              splitSeriesAccessors={['g']}
              stackAccessors={['g']}
            />
            <Axis id="bottom-axis" position="bottom" showGridLines />
            <Axis id="left-axis" position="left" showGridLines />
          </Chart>

          <EuiSpacer />

          <EuiDescriptionList
            listItems={[
              {
                title: 'Latest occurrence',
                description: (
                  <>
                    {moment().format('MMMM Do YYYY, h:mm:ss a')}{' '}
                    <EuiLink>View in Discover</EuiLink>
                  </>
                ),
              },
              {
                title: 'Message',
                description: message,
              },
              {
                title: 'Solution',
                description: (
                  <>
                    <EuiLink external>Read the "Changes to system indices" docs</EuiLink>
                  </>
                ),
              },
            ]}
          />
        </EuiAccordion>
      </EuiPanel>
    </EuiFlexItem>
  );
};

export default () => (
  <EuiPage restrictWidth>
    <EuiPageBody>
      <EuiPageHeader>
        <EuiPageHeaderSection>
          <EuiTitle size="s">
            <h1>Deprecation logs</h1>
          </EuiTitle>
        </EuiPageHeaderSection>

        <EuiPageHeaderSection>
          <EuiFlexGroup gutterSize="s" alignItems="center">
            <EuiFlexItem grow={false}>
              <EuiIconTip
                aria-label="Warning"
                type="alert"
                color="warning"
                content="2 hidden logs contain recent deprecations"
              />
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              4 hidden
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPageHeaderSection>
      </EuiPageHeader>

      <EuiSpacer size="s" />

      <EuiFlexGroup direction="column" gutterSize="xs">
        {deprecations.map((deprecation, index) => <DeprecationLog key={index} id={index} deprecation={deprecation} />)}
      </EuiFlexGroup>
    </EuiPageBody>
  </EuiPage>
);
