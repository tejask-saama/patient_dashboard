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
import AgeDistributionChart from '../components/charts/AgeDistributionChart';
import GenderDistributionChart from '../components/charts/GenderDistributionChart';
import AgeByCountryChart from '../components/charts/AgeByCountryChart';
import TopCitiesChart from '../components/charts/TopCitiesChart';
import LocaleBreakdownChart from '../components/charts/LocaleBreakdownChart';
import RegistrationTrendChart from '../components/charts/RegistrationTrendChart';
import { fetchPatientDemographics, binAges } from '../services/api';

// Motion container for animation
const MotionBox = motion(Box);

const PatientDemographics = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const geography = data?.geography || {};
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const patientData = await fetchPatientDemographics();
        setData(patientData);
      } catch (error) {
        console.error('Error fetching patient demographics:', error);
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
          Patient Demographics
        </Heading>
        <Text color="gray.500" mb={6}>
          Detailed breakdown of patient population metrics
        </Text>
      </MotionBox>

      {/* Key Stats */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <DashboardCard>
          <Stat>
            <StatLabel>Total Patients</StatLabel>
            <StatNumber>{data?.total_patient_count?.toLocaleString() || 0}</StatNumber>
          </Stat>
        </DashboardCard>
        
        <DashboardCard>
          <Stat>
            <StatLabel>Gender Ratio</StatLabel>
            <StatNumber>
              {(() => {
                const males = data?.gender_distribution?.find(g => g.label.toLowerCase() === 'male')?.count || 0;
                const females = data?.gender_distribution?.find(g => g.label.toLowerCase() === 'female')?.count || 0;
                const ratio = females > 0 ? (males / females).toFixed(2) : 'N/A';
                return `${ratio} M:F`;
              })()}
            </StatNumber>
          </Stat>
        </DashboardCard>
        
        <DashboardCard>
          <Stat>
            <StatLabel>Average Age</StatLabel>
            <StatNumber>
              {(() => {
                if (!data?.age_distribution) return 'N/A';
                
                let totalAge = 0;
                let totalCount = 0;
                
                data.age_distribution.forEach(item => {
                  const age = Number(item.value);
                  const count = Number(item.count);
                  
                  if (Number.isFinite(age) && Number.isFinite(count)) {
                    totalAge += age * count;
                    totalCount += count;
                  }
                });
                
                return totalCount > 0 ? (totalAge / totalCount).toFixed(1) : 'N/A';
              })()}
            </StatNumber>
          </Stat>
        </DashboardCard>
        
        <DashboardCard>
          <Stat>
            <StatLabel>Latest Registrations</StatLabel>
            <StatNumber>
              {(() => {
                const trend = data?.registration_trends?.overall || [];
                if (trend.length > 0) {
                  const latest = trend[trend.length - 1];
                  return latest.count?.toLocaleString() || 0;
                }
                return 0;
              })()}
            </StatNumber>
            <StatHelpText>
              {(() => {
                const trend = data?.registration_trends?.overall || [];
                if (trend.length >= 2) {
                  const latest = trend[trend.length - 1].count || 0;
                  const previous = trend[trend.length - 2].count || 0;
                  const change = previous > 0 
                    ? ((latest - previous) / previous * 100).toFixed(1)
                    : 0;
                  
                  return (
                    <>
                      <StatArrow type={change >= 0 ? 'increase' : 'decrease'} />
                      {Math.abs(change)}%
                    </>
                  );
                }
                return null;
              })()}
            </StatHelpText>
          </Stat>
        </DashboardCard>
      </SimpleGrid>

      <Tabs colorScheme="teal" isLazy variant="enclosed" mb={6}>
        <TabList>
          <Tab>Demographics</Tab>
          <Tab>Geography</Tab>
          <Tab>Trends</Tab>
        </TabList>
        
        <TabPanels>
          {/* Demographics Tab */}
          <TabPanel p={0} pt={6}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <DashboardCard 
                title="Age Distribution" 
                subtitle="Patient count by age group"
                height="400px"
              >
                <AgeDistributionChart data={binAges(data?.age_distribution)} />
              </DashboardCard>
              
              <DashboardCard 
                title="Gender Breakdown" 
                subtitle="Distribution of patients by gender"
                height="400px"
              >
                <GenderDistributionChart data={data?.gender_distribution} />
              </DashboardCard>
              
              <DashboardCard 
                title="Average Age by Country" 
                subtitle="Geographic age distribution"
                height="400px"
              >
                <AgeByCountryChart data={data?.cross_cutting?.avg_age_by_country} />
              </DashboardCard>
            </SimpleGrid>
          </TabPanel>
          
          {/* Geography Tab */}
          <TabPanel p={0} pt={6}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <DashboardCard 
                title="Top Cities" 
                subtitle="Patient distribution by city"
                height="400px"
              >
                <TopCitiesChart data={geography.top_cities} />
              </DashboardCard>
              
              <DashboardCard 
                title="Locale Breakdown" 
                subtitle="Urban vs rural distribution"
                height="400px"
              >
                <LocaleBreakdownChart data={geography.locale_breakdown} />
              </DashboardCard>
              
            </SimpleGrid>
          </TabPanel>
          
          {/* Trends Tab */}
          <TabPanel p={0} pt={6}>
            <SimpleGrid columns={{ base: 1, lg: 1 }} spacing={6}>
              <DashboardCard 
                title="Registration Trends" 
                subtitle="Patient registration over time"
                height="400px"
              >
                <RegistrationTrendChart data={data?.registration_trends?.overall} />
              </DashboardCard>
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default PatientDemographics;
