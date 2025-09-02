import React, { useState, useEffect } from 'react';
import { 
  Box, 
  SimpleGrid, 
  Heading, 
  Text, 
  Flex, 
  Spinner,
  useToast
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import DashboardCard from '../components/common/DashboardCard';
import MetricCounter from '../components/common/MetricCounter';
import AgeDistributionChart from '../components/charts/AgeDistributionChart';
import GenderDistributionChart from '../components/charts/GenderDistributionChart';
import EventSeverityChart from '../components/charts/EventSeverityChart';
import EventTypesChart from '../components/charts/EventTypesChart';
import AgeByCountryChart from '../components/charts/AgeByCountryChart';
import { fetchPatientDemographics, fetchAdverseEvents, binAges } from '../services/api';

// Motion container for animation
const MotionBox = motion(Box);

const Dashboard = () => {
  const [patientData, setPatientData] = useState(null);
  const [eventsData, setEventsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [patients, events] = await Promise.all([
          fetchPatientDemographics(),
          fetchAdverseEvents()
        ]);
        
        setPatientData(patients);
        setEventsData(events);
      } catch (error) {
        console.error('Error fetching data:', error);
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
          Healthcare Analytics Dashboard
        </Heading>
        <Text color="gray.500" mb={6}>
          Overview of patient demographics and adverse events
        </Text>
      </MotionBox>

      {/* Key Metrics Row */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <DashboardCard title="Patient Statistics">
          <MetricCounter 
            title="Total Patients" 
            value={patientData?.total_patient_count || 0} 
          />
        </DashboardCard>
        
        <DashboardCard title="Adverse Events">
          <MetricCounter 
            title="Total Events" 
            value={eventsData?.totals?.total_events || 0} 
          />
        </DashboardCard>
        
        <DashboardCard title="Resolution Time">
          <MetricCounter 
            title="Avg Days to Resolution" 
            value={eventsData?.totals?.average_time_to_resolution_days || 0}
            decimals={1}
            suffix=" days"
          />
        </DashboardCard>
        
        <DashboardCard title="Ongoing Events">
          <MetricCounter 
            title="Currently Active" 
            value={eventsData?.totals?.total_ongoing_events || 0} 
          />
        </DashboardCard>
      </SimpleGrid>

      {/* Charts Grid */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
        <DashboardCard 
          title="Age Distribution" 
          subtitle="Patient count by age group"
          height="350px"
        >
          <AgeDistributionChart data={binAges(patientData?.age_distribution)} />
        </DashboardCard>
        
        <DashboardCard 
          title="Gender Breakdown" 
          subtitle="Distribution of patients by gender"
          height="350px"
        >
          <GenderDistributionChart data={patientData?.gender_distribution} />
        </DashboardCard>
      </SimpleGrid>

      {/* Event Analysis */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <DashboardCard 
          title="Event Severity" 
          subtitle="Distribution by severity level"
          height="350px"
        >
          <EventSeverityChart data={eventsData?.distributions?.by_severity} />
        </DashboardCard>
        
        <DashboardCard 
          title="Event Types" 
          subtitle="Most common adverse event types"
          height="350px"
        >
          <EventTypesChart data={eventsData?.distributions?.by_type} />
        </DashboardCard>
      </SimpleGrid>

      {/* Demographics Cross-cutting Analysis */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8} mt={8}>
        <DashboardCard 
          title="Average Age by Country" 
          subtitle="Geographic age distribution"
          height="350px"
        >
          <AgeByCountryChart data={patientData?.cross_cutting?.avg_age_by_country} />
        </DashboardCard>
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
