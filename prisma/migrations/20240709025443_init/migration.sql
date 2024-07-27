-- CreateTable
CREATE TABLE "ServiceType" (
    "id" SERIAL NOT NULL,
    "Type" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "Title" VARCHAR(200) NOT NULL,
    "Time" INTEGER NOT NULL,
    "Price" INTEGER NOT NULL,
    "ServiceTypeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "StartTime" VARCHAR(10) NOT NULL,
    "EndTime" VARCHAR(10) NOT NULL,
    "Address" VARCHAR(255) NOT NULL,
    "Contact" VARCHAR(20) NOT NULL,
    "ServiceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "Name" VARCHAR(150) NOT NULL,
    "Username" VARCHAR(50) NOT NULL,
    "Password" VARCHAR(255) NOT NULL,
    "Role" VARCHAR(20) NOT NULL,
    "Phone" VARCHAR(20) NOT NULL,
    "Email" VARCHAR(150),
    "Address" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_ServiceTypeId_fkey" FOREIGN KEY ("ServiceTypeId") REFERENCES "ServiceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_ServiceId_fkey" FOREIGN KEY ("ServiceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
