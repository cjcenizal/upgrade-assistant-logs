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
  EuiButtonEmpty,
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
  EuiSearchBar,
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
  isFixed: true,
  level: WARNING,
  category: 'Index access',
  title: 'Some other index-related deprecation',
  message: 'This request accesses system indices: [.apm-agent-configuration, .apm-custom-link, .kibana_1, .kibana_task_manager_1, .security-7], but in a future major version, direct access to system indices will be prevented by default',
}, {
  isFixed: false,
  level: CRITICAL,
  category: 'Another category',
  title: 'Another API is being used in a deprecated manner',
  message: 'This request accesses system indices: [.apm-agent-configuration, .apm-custom-link, .kibana_1, .kibana_task_manager_1, .security-7], but in a future major version, direct access to system indices will be prevented by default',
}, {
  isFixed: false,
  level: CRITICAL,
  category: 'Another category',
  title: 'Looks like something else is wrong',
  message: 'This request accesses system indices: [.apm-agent-configuration, .apm-custom-link, .kibana_1, .kibana_task_manager_1, .security-7], but in a future major version, direct access to system indices will be prevented by default',
}, {
  isFixed: false,
  level: CRITICAL,
  category: 'Sandwiches',
  title: 'The sandwich API no longer supports rye',
  message: 'This request accesses system indices: [.apm-agent-configuration, .apm-custom-link, .kibana_1, .kibana_task_manager_1, .security-7], but in a future major version, direct access to system indices will be prevented by default',
}, {
  isFixed: false,
  level: WARNING,
  category: 'Carbonation',
  title: 'Carbonate drinks with the Fizzy API, not the CO2 API',
  message: 'This request accesses system indices: [.apm-agent-configuration, .apm-custom-link, .kibana_1, .kibana_task_manager_1, .security-7], but in a future major version, direct access to system indices will be prevented by default',
}, {
  isFixed: false,
  level: WARNING,
  category: 'Carbonation',
  title: 'flat: true is no longer a supported config',
  message: 'This request accesses system indices: [.apm-agent-configuration, .apm-custom-link, .kibana_1, .kibana_task_manager_1, .security-7], but in a future major version, direct access to system indices will be prevented by default',
}];

const generateData = (isFixed) => {
  const data = [];
  const types = ['Deprecation', 'Success'];
  const days = 14;

  for (let day = 0; day < days; day++) {
    const countA = Math.floor(Math.random() * 200);
    const countB = Math.floor(Math.random() * 200);

    let typeError;
    let typeSuccess;

    types.forEach(type => {
      if (day === days - 1) {
        typeError = countA + countB;
        typeSuccess = 0;
      } else if (isFixed && day === 0) {
        typeError = 0;
        typeSuccess = countA + countB;
      } else {
        typeError = countA;
        typeSuccess = countB;
      }

      data.unshift({
        x: moment().subtract(day, 'days').format('MMM DD'),
        y: type === 'Deprecation' ? typeError : typeSuccess,
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
          color="danger"
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
      <div>{title}</div>
    </EuiFlexItem>
  </EuiFlexGroup>
);

const DeprecationLogActions = () => (
  <EuiFlexGroup alignItems="baseline">
    <EuiFlexItem grow={false}>
      <EuiLink>View in&hellip;</EuiLink>
    </EuiFlexItem>

    <EuiFlexItem grow={false}>
      <EuiLink>Clients</EuiLink>
    </EuiFlexItem>

    <EuiFlexItem grow={false}>
      <EuiLink external={true} href="#">Docs</EuiLink>
    </EuiFlexItem>

    <EuiFlexItem grow={false}>
      <EuiLink>Test</EuiLink>
    </EuiFlexItem>

    <EuiFlexItem grow={false}>
      <EuiLink>Hide</EuiLink>
    </EuiFlexItem>
  </EuiFlexGroup>
);

const DeprecationLog = ({ id, deprecation: { isFixed, level, title, category, message } }) => {
  const data = generateData(isFixed);

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
                title: `${category}: ${title}`,
                description: message,
              },
              {
                title: isFixed ? 'This appears to have been addressed' : 'Deprecated features appear to be in use',
                description: (
                  <>
                    Latest log {isFixed ? 'was successful at' : 'showed a deprecation at'}{' '}{moment().format('MMMM Do YYYY, h:mm:ss a')}{' '}
                    <EuiLink>View JSON</EuiLink>
                  </>
                ),
              },
              {
                title: 'Solution',
                description: (
                  <>
                    <EuiLink external={true} href="#">Read the "Changes to system indices" docs</EuiLink>
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

const SearchBar = () => {
  const levels = [
    { name: CRITICAL, value: 'danger' },
    { name: WARNING, value: 'warning' },
  ];

  const categories = [
    { name: 'Index access', value: 'a' },
    { name: 'Something else', value: 'b' },
  ];

  const filters = [
    {
      type: 'field_value_toggle_group',
      field: 'status',
      items: [
        {
          value: 'success',
          name: 'Success',
        },
        {
          value: 'deprecation',
          name: 'Deprecation',
        },
      ],
    },
    // {
    //   type: 'is',
    //   field: 'fixed',
    //   name: 'Fixed',
    //   negatedName: 'Inactive',
    // },
    // {
    //   type: 'field_value_toggle',
    //   name: 'Mine',
    //   field: 'owner',
    //   value: 'dewey',
    // },
    // {
    //   type: 'field_value_toggle',
    //   name: 'Popular',
    //   field: 'followers',
    //   value: 5,
    //   operator: 'gt',
    // },
    {
      type: 'field_value_selection',
      field: 'category',
      name: 'Category',
      multiSelect: 'or',
      operator: 'exact',
      options: categories,
    },
    {
      type: 'field_value_selection',
      field: 'level',
      name: 'Level',
      multiSelect: 'or',
      operator: 'exact',
      options: levels,
    },
  ];

  return (
    <EuiSearchBar
      defaultQuery={''}
      filters={filters}
      onChange={() => {}}
    />
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
                color="danger"
                content="2 hidden logs contain recent deprecations"
              />
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <EuiButtonEmpty
                onClick={() => {}}
                iconType="arrowDown"
                iconSide="right"
              >
                4 hidden
              </EuiButtonEmpty>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPageHeaderSection>
      </EuiPageHeader>

      <SearchBar />

      <EuiSpacer size="m" />

      <EuiFlexGroup direction="column" gutterSize="xs">
        {deprecations.map((deprecation, index) => <DeprecationLog key={index} id={index} deprecation={deprecation} />)}
      </EuiFlexGroup>
    </EuiPageBody>
  </EuiPage>
);
