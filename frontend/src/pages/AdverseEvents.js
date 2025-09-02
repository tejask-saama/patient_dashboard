import React, { useState, useEffect } from 'react';
import { 
  Box, 
  SimpleGrid, 
  Heading, 
  Text, 
  Flex, 
  Spinner,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import DashboardCard from '../components/common/DashboardCard';
import MetricCounter from '../components/common/MetricCounter';
import EventSeverityChart from '../components/charts/EventSeverityChart';
import EventTypesChart from '../components/charts/EventTypesChart';
import { fetchAdverseEvents } from '../services/api';

// Motion container for animation
const MotionBox = motion(Box);

const AdverseEvents = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const eventsData = await fetchAdverseEvents();
        setData(eventsData);
      } catch (error) {
        console.error('Error fetching adverse events:', error);
        toast({
          title: 'Error loading data',
          description: 'Please check if the backend server is running.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 6 }}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Heading size="lg" mb={2}>
          Adverse Events
        </Heading>
        <Text color="gray.500" mb={6}>
          Analysis of patient adverse events and incidents
        </Text>
      </MotionBox>

      {/* Key Metrics */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <DashboardCard>
          <Stat>
            <StatLabel>Total Events</StatLabel>
            <StatNumber>{data?.totals?.total_events?.toLocaleString() || 0}</StatNumber>
          </Stat>
        </DashboardCard>
        
        <DashboardCard>
          <Stat>
            <StatLabel>Avg Resolution Time</StatLabel>
            <StatNumber>{data?.totals?.average_time_to_resolution_days?.toFixed(1) || 0} days</StatNumber>
          </Stat>
        </DashboardCard>
        
        <DashboardCard>
          <Stat>
            <StatLabel>Ongoing Events</StatLabel>
            <StatNumber>{data?.totals?.total_ongoing_events?.toLocaleString() || 0}</StatNumber>
            <StatHelpText>
              {(() => {
                const total = data?.totals?.total_events || 0;
                const ongoing = data?.totals?.total_ongoing_events || 0;
                if (total > 0) {
                  const percent = (ongoing / total * 100).toFixed(1);
                  return `${percent}% of total`;
                }
                return null;
              })()}
            </StatHelpText>
          </Stat>
        </DashboardCard>
        
        <DashboardCard>
          <Stat>
            <StatLabel>Critical Events</StatLabel>
            <StatNumber>
              {(() => {
                const severityData = data?.severity_distribution || [];
                const critical = severityData.find(s => s.label === 'Critical')?.count || 0;
                return critical.toLocaleString();
              })()}
            </StatNumber>
            <StatHelpText>
              {(() => {
                const severityData = data?.severity_distribution || [];
                const critical = severityData.find(s => s.label === 'Critical')?.count || 0;
                const total = data?.totals?.total_events || 0;
                
                if (total > 0) {
                  const percent = (critical / total * 100).toFixed(1);
                  return `${percent}% of total`;
                }
                return null;
              })()}
            </StatHelpText>
          </Stat>
        </DashboardCard>
      </SimpleGrid>

      <Tabs colorScheme="teal" isLazy variant="enclosed" mb={6}>
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Resolution</Tab>
          <Tab>Trends</Tab>
        </TabList>
        
        <TabPanels>
          {/* Overview Tab */}
          <TabPanel p={0} pt={6}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <DashboardCard 
                title="Event Severity" 
                subtitle="Distribution by severity level"
                height="400px"
              >
                <EventSeverityChart data={data?.severity_distribution} />
              </DashboardCard>
              
              <DashboardCard 
                title="Event Types" 
                subtitle="Most common adverse event types"
                height="400px"
              >
                <EventTypesChart data={data?.event_types} />
              </DashboardCard>
              
              <DashboardCard 
                title="Events by Department" 
                subtitle="Distribution across hospital departments"
                height="400px"
              >
                <Box p={10} textAlign="center" color="gray.500">
                  Department distribution chart will be displayed here
                </Box>
              </DashboardCard>
              
              <DashboardCard 
                title="Patient Impact" 
                subtitle="Level of impact on patients"
                height="400px"
              >
                <Box p={10} textAlign="center" color="gray.500">
                  Patient impact chart will be displayed here
                </Box>
              </DashboardCard>
            </SimpleGrid>
          </TabPanel>
          
          {/* Resolution Tab */}
          <TabPanel p={0} pt={6}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <DashboardCard 
                title="Resolution Time by Severity" 
                subtitle="Days to resolution by event severity"
                height="400px"
              >
                <Box p={10} textAlign="center" color="gray.500">
                  Resolution time chart will be displayed here
                </Box>
              </DashboardCard>
              
              <DashboardCard 
                title="Resolution Rate" 
                subtitle="Percentage of events resolved"
                height="400px"
              >
                <Box p={10} textAlign="center" color="gray.500">
                  Resolution rate chart will be displayed here
                </Box>
              </DashboardCard>
            </SimpleGrid>
          </TabPanel>
          
          {/* Trends Tab */}
          <TabPanel p={0} pt={6}>
            <SimpleGrid columns={{ base: 1 }} spacing={6}>
              <DashboardCard 
                title="Event Occurrence Over Time" 
                subtitle="Monthly trend of adverse events"
                height="400px"
              >
                <Box p={10} textAlign="center" color="gray.500">
                  Event trends chart will be displayed here
                </Box>
              </DashboardCard>
              
              <DashboardCard 
                title="Severity Trends" 
                subtitle="Changes in severity distribution over time"
                height="400px"
              >
                <Box p={10} textAlign="center" color="gray.500">
                  Severity trends chart will be displayed here
                </Box>
              </DashboardCard>
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AdverseEvents;
