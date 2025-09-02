CREATE TABLE "patient_demography" (
"PatientID" TEXT,
  "FirstName" TEXT,
  "LastName" TEXT,
  "Gender" TEXT,
  "BirthDate" TEXT,
  "Age" INTEGER,
  "BloodType" TEXT,
  "Height_cm" REAL,
  "Weight_kg" REAL,
  "PhoneNumber" TEXT,
  "Email" TEXT,
  "Address" TEXT,
  "City" TEXT,
  "Country" TEXT,
  "Nationality" TEXT,
  "MaritalStatus" TEXT,
  "InsuranceProvider" TEXT,
  "InsuranceID" TEXT,
  "Locale" TEXT,
  "RegistrationDate" TEXT
);

CREATE UNIQUE INDEX idx_patient_primary ON patient_demography(PatientID);



CREATE TABLE "patient_appointments" (
"AppointmentID" TEXT,
  "PatientID" TEXT,
  "ScheduledDateTime" TEXT,
  "EndDateTime" TEXT,
  "AppointmentType" TEXT,
  "Department" TEXT,
  "PhysicianName" TEXT,
  "Status" TEXT,
  "Location" TEXT,
  "RoomNumber" TEXT,
  "Notes" TEXT,
  "Created" TEXT,
  "LastModified" TEXT
);

CREATE UNIQUE INDEX idx_appointment_primary ON patient_appointments(AppointmentID);


-- adverse_events definition

CREATE TABLE "adverse_events" (
"AdverseEventID" TEXT,
  "PatientID" TEXT,
  "EventDate" TEXT,
  "EventType" TEXT,
  "EventDescription" TEXT,
  "Severity" TEXT,
  "Location" TEXT,
  "ReportedBy" TEXT,
  "ActionTaken" TEXT,
  "Resolution" TEXT,
  "ResolutionDate" TEXT
);

CREATE UNIQUE INDEX idx_adverse_primary ON adverse_events(AdverseEventID);