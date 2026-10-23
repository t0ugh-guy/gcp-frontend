export interface SeedParcel {
  id: string
  location: string
  area: number
  state: string
  lat: number
  lng: number
  status?: string
  allottedOn?: string
  appliedOn?: string
  forestType?: string
  degradation?: 'Low' | 'Medium' | 'High'
  kmlCoordinates?: string
}

export interface SeedLedgerEntry {
  id: string
  date: string
  activity: string
  parcelId: string
  credits: number
  type: string
}

export interface SeedRedemption {
  id: string
  date: string
  purpose: string
  creditsUsed: number
  status: string
}

export interface SeedCompany {
  id: string
  name: string
  CIN: string
  sector: string
  state: string
  contactPerson: string
  email: string
  registeredOn: string
  credentials: { username: string; password?: string }
  allocatedParcels: SeedParcel[]
  pendingParcels: SeedParcel[]
  credits: { earned: number; redeemed: number; inPipeline: number }
  ledger: SeedLedgerEntry[]
  redemptionHistory: SeedRedemption[]
}

export const companies: SeedCompany[] = [
  {
    id: 'tata',
    name: 'Tata Power Ltd.',
    CIN: 'L12345MH1919PLC000001',
    sector: 'Energy',
    state: 'Maharashtra',
    contactPerson: 'Rohan Mehta',
    email: 'rohan.mehta@tatapower.com',
    registeredOn: '14 March 2024',
    credentials: { username: 'tata_power', password: 'tata@123' },
    allocatedParcels: [
      {
        id: 'GCP-MH-2024-001',
        location: 'Palghar Forest Belt, Maharashtra',
        area: 18.5,
        state: 'Maharashtra',
        lat: 19.6967,
        lng: 72.7697,
        status: 'Active',
        allottedOn: '15 Apr 2024',
      },
      {
        id: 'GCP-RJ-2024-047',
        location: 'Aravalli Scrubland Zone, Rajasthan',
        area: 15.8,
        state: 'Rajasthan',
        lat: 25.1462,
        lng: 73.7124,
        status: 'Active',
        allottedOn: '02 Jun 2024',
      },
      {
        id: 'GCP-MP-2024-103',
        location: 'Satpura Buffer Zone, Madhya Pradesh',
        area: 13.0,
        state: 'Madhya Pradesh',
        lat: 22.3372,
        lng: 78.2115,
        status: 'Active',
        allottedOn: '28 Jul 2024',
      },
    ],
    pendingParcels: [
      {
        id: 'GCP-KA-PEND-005',
        location: 'Bandipur Buffer, Karnataka',
        area: 7.5,
        state: 'Karnataka',
        lat: 11.6854,
        lng: 76.6348,
        appliedOn: '10 Mar 2025',
      },
    ],
    credits: { earned: 1840, redeemed: 320, inPipeline: 640 },
    ledger: [
      { id: 'TAT-LED-001', date: '12 Jan 2025', activity: 'Canopy Verification', parcelId: 'GCP-MH-2024-001', credits: 180, type: 'Earned' },
      { id: 'TAT-LED-002', date: '01 Feb 2025', activity: 'Soil Carbon Validation', parcelId: 'GCP-RJ-2024-047', credits: 210, type: 'Earned' },
      { id: 'TAT-LED-003', date: '17 Feb 2025', activity: 'Offset Redemption', parcelId: 'N/A', credits: -120, type: 'Redeemed' },
      { id: 'TAT-LED-004', date: '05 Mar 2025', activity: 'Biodiversity Milestone', parcelId: 'GCP-MP-2024-103', credits: 260, type: 'Earned' },
      { id: 'TAT-LED-005', date: '22 Mar 2025', activity: 'Offset Redemption', parcelId: 'N/A', credits: -200, type: 'Redeemed' },
    ],
    redemptionHistory: [
      { id: 'TAT-RED-001', date: '17 Feb 2025', purpose: 'Thermal Emission Offset', creditsUsed: 120, status: 'Approved' },
      { id: 'TAT-RED-002', date: '22 Mar 2025', purpose: 'Scope 2 Neutralization', creditsUsed: 200, status: 'Approved' },
    ],
  },
  {
    id: 'infosys',
    name: 'Infosys Ltd.',
    CIN: 'L85110KA1981PLC013115',
    sector: 'IT Services',
    state: 'Karnataka',
    contactPerson: 'Priya Nair',
    email: 'priya.nair@infosys.com',
    registeredOn: '02 June 2024',
    credentials: { username: 'infosys_ltd', password: 'infy@123' },
    allocatedParcels: [
      {
        id: 'GCP-KA-2024-022',
        location: 'Bandipur Buffer Zone, Karnataka',
        area: 12.0,
        state: 'Karnataka',
        lat: 11.6854,
        lng: 76.6348,
        status: 'Active',
        allottedOn: '18 Jun 2024',
      },
      {
        id: 'GCP-TN-2024-058',
        location: 'Nilgiri Buffer, Tamil Nadu',
        area: 9.5,
        state: 'Tamil Nadu',
        lat: 11.4064,
        lng: 76.6932,
        status: 'Active',
        allottedOn: '30 Jul 2024',
      },
    ],
    pendingParcels: [
      {
        id: 'GCP-MH-PEND-031',
        location: 'Melghat Buffer, Maharashtra',
        area: 14.2,
        state: 'Maharashtra',
        lat: 21.5244,
        lng: 77.2134,
        appliedOn: '22 Feb 2025',
      },
    ],
    credits: { earned: 980, redeemed: 150, inPipeline: 310 },
    ledger: [
      { id: 'INF-LED-001', date: '05 Jan 2025', activity: 'Canopy Verification', parcelId: 'GCP-KA-2024-022', credits: 130, type: 'Earned' },
      { id: 'INF-LED-002', date: '27 Jan 2025', activity: 'Water Retention Uplift', parcelId: 'GCP-TN-2024-058', credits: 95, type: 'Earned' },
      { id: 'INF-LED-003', date: '19 Feb 2025', activity: 'Offset Redemption', parcelId: 'N/A', credits: -60, type: 'Redeemed' },
      { id: 'INF-LED-004', date: '08 Mar 2025', activity: 'Habitat Regeneration', parcelId: 'GCP-KA-2024-022', credits: 140, type: 'Earned' },
    ],
    redemptionHistory: [
      { id: 'INF-RED-001', date: '19 Feb 2025', purpose: 'Data Center Emission Offset', creditsUsed: 60, status: 'Approved' },
      { id: 'INF-RED-002', date: '29 Mar 2025', purpose: 'Corporate Net-Zero Target', creditsUsed: 90, status: 'Approved' },
    ],
  },
  {
    id: 'ultratech',
    name: 'Ultratech Cement Ltd.',
    CIN: 'L26940GJ2000PLC034685',
    sector: 'Manufacturing',
    state: 'Gujarat',
    contactPerson: 'Amit Desai',
    email: 'amit.desai@ultratechcement.com',
    registeredOn: '28 July 2024',
    credentials: { username: 'ultratech_cement', password: 'ultra@123' },
    allocatedParcels: [
      {
        id: 'GCP-GJ-2024-009',
        location: 'Gir Periphery Zone, Gujarat',
        area: 21.2,
        state: 'Gujarat',
        lat: 21.1239,
        lng: 70.6462,
        status: 'Active',
        allottedOn: '10 Aug 2024',
      },
      {
        id: 'GCP-OR-2024-031',
        location: 'Simlipal Buffer, Odisha',
        area: 17.5,
        state: 'Odisha',
        lat: 21.6333,
        lng: 86.5333,
        status: 'Active',
        allottedOn: '25 Sep 2024',
      },
      {
        id: 'GCP-RJ-2024-072',
        location: 'Thar Desert Fringe, Rajasthan',
        area: 8.0,
        state: 'Rajasthan',
        lat: 26.9124,
        lng: 70.9161,
        status: 'Active',
        allottedOn: '05 Oct 2024',
      },
    ],
    pendingParcels: [],
    credits: { earned: 2100, redeemed: 500, inPipeline: 720 },
    ledger: [
      { id: 'ULT-LED-001', date: '09 Jan 2025', activity: 'Canopy Verification', parcelId: 'GCP-GJ-2024-009', credits: 250, type: 'Earned' },
      { id: 'ULT-LED-002', date: '06 Feb 2025', activity: 'Offset Redemption', parcelId: 'N/A', credits: -220, type: 'Redeemed' },
      { id: 'ULT-LED-003', date: '24 Feb 2025', activity: 'Soil Carbon Validation', parcelId: 'GCP-OR-2024-031', credits: 260, type: 'Earned' },
      { id: 'ULT-LED-004', date: '14 Mar 2025', activity: 'Offset Redemption', parcelId: 'N/A', credits: -280, type: 'Redeemed' },
      { id: 'ULT-LED-005', date: '27 Mar 2025', activity: 'Biodiversity Milestone', parcelId: 'GCP-RJ-2024-072', credits: 310, type: 'Earned' },
    ],
    redemptionHistory: [
      { id: 'ULT-RED-001', date: '06 Feb 2025', purpose: 'Kiln Emission Offset', creditsUsed: 220, status: 'Approved' },
      { id: 'ULT-RED-002', date: '14 Mar 2025', purpose: 'Scope 1 Decarbonization', creditsUsed: 280, status: 'Approved' },
      { id: 'ULT-RED-003', date: '01 Apr 2025', purpose: 'Green Logistics Program', creditsUsed: 120, status: 'In Progress' },
    ],
  },
  {
    id: 'mahindra',
    name: 'Mahindra & Mahindra Ltd.',
    CIN: 'L65990MH1945PLC004558',
    sector: 'Automobile',
    state: 'Maharashtra',
    contactPerson: 'Sneha Kulkarni',
    email: 'sneha.kulkarni@mahindra.com',
    registeredOn: '10 September 2024',
    credentials: { username: 'mahindra_mm', password: 'mahi@123' },
    allocatedParcels: [
      {
        id: 'GCP-HP-2024-014',
        location: 'Kangra Valley, Himachal Pradesh',
        area: 6.5,
        state: 'Himachal Pradesh',
        lat: 32.0998,
        lng: 76.2691,
        status: 'Active',
        allottedOn: '20 Sep 2024',
      },
      {
        id: 'GCP-UK-2024-038',
        location: 'Corbett Periphery, Uttarakhand',
        area: 11.0,
        state: 'Uttarakhand',
        lat: 29.53,
        lng: 78.7747,
        status: 'Active',
        allottedOn: '14 Oct 2024',
      },
    ],
    pendingParcels: [
      {
        id: 'GCP-AS-PEND-007',
        location: 'Kaziranga Fringe, Assam',
        area: 7.8,
        state: 'Assam',
        lat: 26.5775,
        lng: 93.17,
        appliedOn: '01 Apr 2025',
      },
    ],
    credits: { earned: 620, redeemed: 80, inPipeline: 240 },
    ledger: [
      { id: 'MAH-LED-001', date: '11 Jan 2025', activity: 'Canopy Verification', parcelId: 'GCP-HP-2024-014', credits: 90, type: 'Earned' },
      { id: 'MAH-LED-002', date: '03 Feb 2025', activity: 'Offset Redemption', parcelId: 'N/A', credits: -40, type: 'Redeemed' },
      { id: 'MAH-LED-003', date: '21 Feb 2025', activity: 'Habitat Regeneration', parcelId: 'GCP-UK-2024-038', credits: 120, type: 'Earned' },
      { id: 'MAH-LED-004', date: '18 Mar 2025', activity: 'Water Retention Uplift', parcelId: 'GCP-UK-2024-038', credits: 110, type: 'Earned' },
    ],
    redemptionHistory: [
      { id: 'MAH-RED-001', date: '03 Feb 2025', purpose: 'Fleet Emission Offset', creditsUsed: 40, status: 'Approved' },
      { id: 'MAH-RED-002', date: '30 Mar 2025', purpose: 'Plant Carbon Neutrality', creditsUsed: 40, status: 'Approved' },
    ],
  },
]

export const GLOBAL_AVAILABLE_PARCELS: SeedParcel[] = [
  {
    id: 'GCP-HP-AVL-007',
    location: 'Kangra Valley North, Himachal Pradesh',
    area: 6.0,
    state: 'Himachal Pradesh',
    forestType: 'Temperate',
    degradation: 'Low',
    lat: 32.1839,
    lng: 76.3145,
  },
  {
    id: 'GCP-UK-AVL-019',
    location: 'Corbett Fringe East, Uttarakhand',
    area: 9.3,
    state: 'Uttarakhand',
    forestType: 'Sub-Himalayan',
    degradation: 'Medium',
    lat: 29.4968,
    lng: 78.8428,
  },
  {
    id: 'GCP-AS-AVL-003',
    location: 'Kaziranga Buffer South, Assam',
    area: 7.8,
    state: 'Assam',
    forestType: 'Alluvial Grassland',
    degradation: 'Medium',
    lat: 26.5775,
    lng: 93.12,
  },
  {
    id: 'GCP-WB-AVL-011',
    location: 'Sundarbans Fringe, West Bengal',
    area: 5.5,
    state: 'West Bengal',
    forestType: 'Mangrove',
    degradation: 'High',
    lat: 21.9497,
    lng: 88.9678,
  },
  {
    id: 'GCP-CG-AVL-024',
    location: 'Bastar Forest Zone, Chhattisgarh',
    area: 18.0,
    state: 'Chhattisgarh',
    forestType: 'Tropical Moist',
    degradation: 'High',
    lat: 19.0748,
    lng: 81.9547,
  },
  {
    id: 'GCP-MH-AVL-128',
    location: 'VASERA-128/1A3, Bhandara, Maharashtra',
    area: 5.0,
    state: 'Maharashtra',
    forestType: 'Dry Deciduous',
    degradation: 'Medium',
    lat: 21.388,
    lng: 79.528,
    kmlCoordinates: "79.52854855383138,21.38570229533078,0 79.529377,21.38572,0 79.529386,21.385739,0 79.5294392824073,21.38585698424159,0 79.529538,21.385944,0 79.529569,21.385989,0 79.529685,21.386056,0 79.52971599999999,21.38608,0 79.52970999999999,21.386155,0 79.529645,21.38622,0 79.52954,21.386307,0 79.52946,21.386373,0 79.529432,21.386396,0 79.52938899999999,21.386458,0 79.52934399999999,21.386586,0 79.529372,21.386659,0 79.529392,21.386768,0 79.52940700000001,21.386794,0 79.529421,21.386965,0 79.529242,21.387028,0 79.529201,21.38704,0 79.528978,21.387019,0 79.528921,21.386991,0 79.528858,21.386997,0 79.528678,21.387114,0 79.528544,21.387267,0 79.528561,21.387335,0 79.528559,21.387367,0 79.528516,21.387409,0 79.528548,21.387495,0 79.528541,21.387617,0 79.52850100000001,21.387663,0 79.528454,21.387718,0 79.52840500000001,21.387773,0 79.52833200000001,21.387847,0 79.528363,21.387895,0 79.5284,21.387899,0 79.52842099999999,21.387927,0 79.528555,21.38802,0 79.52858500000001,21.388038,0 79.528632,21.388079,0 79.528768,21.388165,0 79.528859,21.388209,0 79.528914,21.388224,0 79.529032,21.388261,0 79.52905199999999,21.388243,0 79.529231,21.388174,0 79.52933230849342,21.38813539080197,0 79.52945371896232,21.38806596716392,0 79.52959002045235,21.38800912848151,0 79.52976232566898,21.38796875118244,0 79.52983478055289,21.38792256726507,0 79.529923043072,21.38792013680436,0 79.52998693117532,21.38796540361117,0 79.53002111803215,21.38800477886016,0 79.53000854381781,21.38804135599591,0 79.53003620728414,21.38807837687442,0 79.53002861592573,21.38811748405633,0 79.53001500000001,21.388163,0 79.529927,21.388273,0 79.529916,21.388307,0 79.52987,21.388368,0 79.52984270414409,21.38844955232956,0 79.52983325523016,21.38850062635342,0 79.52979856153308,21.38855450153484,0 79.52975600000001,21.388605,0 79.529709,21.388648,0 79.52964707589187,21.38870838393131,0 79.52962161626513,21.38875647305819,0 79.52960289252722,21.38880046077006,0 79.52961483753977,21.38885864640439,0 79.5295718423493,21.38892544315311,0 79.52952999999999,21.388985,0 79.529526,21.388988,0 79.52943399999999,21.389065,0 79.529275,21.389122,0 79.52909699999999,21.389146,0 79.528982,21.389197,0 79.52886599999999,21.389253,0 79.528721,21.389315,0 79.528712,21.389335,0 79.52873,21.389488,0 79.52865199999999,21.38965,0 79.52849999999999,21.389749,0 79.52839299999999,21.389816,0 79.528323,21.389851,0 79.52822500000001,21.389838,0 79.528032,21.38986,0 79.527869,21.389967,0 79.52785900000001,21.389987,0 79.52777399999999,21.390067,0 79.52765599999999,21.390214,0 79.52756701420623,21.39022950842553,0 79.52748459896242,21.39020954754412,0 79.52745311392556,21.39019499660006,0 79.52732084297067,21.39009243998914,0 79.52722471349441,21.39004245249608,0 79.52711005749165,21.38998846480403,0 79.52697934601851,21.38987299892153,0 79.52686533616651,21.3897706982747,0 79.52672918777415,21.38967920175931,0 79.52661975260139,21.38960552882091,0 79.52654196185733,21.38954941655552,0 79.52641028820017,21.38951303267877,0 79.52632887609005,21.38945334937076,0 79.5263216919641,21.38931450198544,0 79.52632033923454,21.38919629680209,0 79.52633454729288,21.38906563961363,0 79.5263224598704,21.3889280157528,0 79.5263314301445,21.38883614155905,0 79.52633511452122,21.38874160183628,0 79.5263676866182,21.38863454053935,0 79.5264290143637,21.38856752227766,0 79.52655740871478,21.38852872589411,0 79.52676897311173,21.38852678860541,0 79.52697436168984,21.38851325942741,0 79.52707999423811,21.38838726057598,0 79.52705312561923,21.38815800378377,0 79.52708338648814,21.38800167695604,0 79.52718318985448,21.38786005352577,0 79.52723284904282,21.38780241219512,0 79.52740366833737,21.38775838281046,0 79.52751430104259,21.38768500611593,0 79.52755601648319,21.38753749102473,0 79.5275690444861,21.3873720783875,0 79.52755509274618,21.38725428936593,0 79.5277027422527,21.38706729156444,0 79.52782142098182,21.38701932675962,0 79.52799462740742,21.386905867704,0 79.52810084742494,21.38664576873024,0 79.52811856643419,21.38653912941321,0 79.52818854415759,21.38642318316453,0 79.52818999666493,21.38625789715518,0 79.52820777694082,21.3861156701768,0 79.5282182467582,21.38596544338245,0 79.52826094751084,21.38586614833737,0 79.52829225089918,21.38580875626682,0 79.5283364255455,21.3857483517497,0 79.52854855383138,21.38570229533078,0",
  },
]
