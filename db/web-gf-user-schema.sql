CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "Name" VARCHAR(100) NOT NULL,
    "Email" VARCHAR(70) NOT NULL,
    "Secret" VARCHAR(60) NOT NULL,
    "Username" VARCHAR(30) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "User_cards" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "Name" VARCHAR(30) NOT NULL,
    "Number" VARCHAR(16) NOT NULL,
    "CVV" VARCHAR(3) NOT NULL,
    "Exp_Date" VARCHAR(7) NOT NULL,
    "User_id" UUID NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "user_cards_user_id_foreign" FOREIGN KEY ("User_id") REFERENCES "User"("id")
);

CREATE TABLE "Payments" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "Service_provided" UUID NOT NULL,
    "Method" UUID NOT NULL,
    "Account" UUID NOT NULL,
    "Date" DATE NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "payments_account_foreign" FOREIGN KEY ("Account") REFERENCES "Gf_accounts"("id")
);

CREATE TABLE "Services" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "Name" VARCHAR(100) NOT NULL,
    "Description" VARCHAR(150) NOT NULL,
    "Value" BIGINT NOT NULL,
    "Gf_id" UUID NOT NULL,
    "Date" DATE NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "services_gf_id_foreign" FOREIGN KEY ("Gf_id") REFERENCES "Gf"("id")
);

CREATE TABLE "Gf" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "Name" VARCHAR(100) NOT NULL,
    "Email" VARCHAR(70) NOT NULL,
    "Secret" VARCHAR(60) NOT NULL,
    "Username" VARCHAR(30) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "Services_provided" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "User_id" UUID NOT NULL,
    "Gf_id" UUID NOT NULL,
    "Service" UUID NOT NULL,
    "Date" DATE NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "services_provided_user_id_foreign" FOREIGN KEY ("User_id") REFERENCES "User"("id"),
    CONSTRAINT "services_provided_gf_id_foreign" FOREIGN KEY ("Gf_id") REFERENCES "Gf"("id"),
    CONSTRAINT "services_provided_service_foreign" FOREIGN KEY ("Service") REFERENCES "Services"("id")
);

CREATE TABLE "Payment_methods" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "Name" VARCHAR(255) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "Gf_accounts" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "Number" UUID NOT NULL,
    "Agency" UUID NOT NULL,
    "Gf_id" UUID NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "gf_accounts_gf_id_foreign" FOREIGN KEY ("Gf_id") REFERENCES "Gf"("id")
);

ALTER TABLE "Payments" ADD CONSTRAINT "payments_method_foreign" FOREIGN KEY ("Method") REFERENCES "Payment_methods"("id");
ALTER TABLE "Services_provided" ADD CONSTRAINT "services_provided_payment_service_foreign" FOREIGN KEY ("Service_provided") REFERENCES "Services_provided"("id");
