export class SlotStatus {
    public static AVAILABLE: string = "AVAILABLE";
    public static BOOKED: string = "BOOKED";
    public static APPROVED: string = "APPROVED";
}

export class SlotTypes {
    public static DOCTOR: string = "DOCTOR"; // DEFAULT
    public static PCR_TEST: string = "PCR_TEST";
    public static PCR_VACCINATION: string = "PCR_VACCINATION";
    public static MEDICAPP_PCR: string = "MEDICAPP_PCR";
}
