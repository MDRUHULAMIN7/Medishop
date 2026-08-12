export interface LocationData {
  division: string;
  districts: {
    name: string;
    thanas: string[];
  }[];
}

export const BANGLADESH_LOCATIONS: LocationData[] = [
  {
    division: 'Dhaka',
    districts: [
      {
        name: 'Dhaka',
        thanas: [
          'Dhanmondi',
          'Gulshan',
          'Banani',
          'Uttara',
          'Mirpur',
          'Mohammadpur',
          'Tejgaon',
          'Motijheel',
          'Badda',
          'Khilgaon',
          'Ramna',
          'Shahbagh',
          'Paltan',
          'Jatrabari',
          'Lalbagh',
          'Hazaribagh',
          'Savar',
          'Keraniganj',
          'Dhamrai',
        ],
      },
      {
        name: 'Gazipur',
        thanas: ['Gazipur Sadar', 'Tongi', 'Kaliakair', 'Kapasia', 'Sreepur', 'Kaliganj'],
      },
      {
        name: 'Narayanganj',
        thanas: ['Narayanganj Sadar', 'Bandar', 'Fatullah', 'Siddhirganj', 'Sonargaon', 'Rupganj', 'Araihazar'],
      },
      {
        name: 'Tangail',
        thanas: ['Tangail Sadar', 'Mirzapur', 'Kalihati', 'Ghatail', 'Madhupur', 'Gopalpur', 'Sakhipur'],
      },
      {
        name: 'Faridpur',
        thanas: ['Faridpur Sadar', 'Bhanga', 'Boalmari', 'Nagarkanda', 'Sadarpur'],
      },
      {
        name: 'Manikganj',
        thanas: ['Manikganj Sadar', 'Singair', 'Saturia', 'Shibalaya', 'Harirampur'],
      },
      {
        name: 'Munshiganj',
        thanas: ['Munshiganj Sadar', 'Sreenagar', 'Sirajdikhan', 'Louhajang', 'Gazaria'],
      },
      {
        name: 'Narsingdi',
        thanas: ['Narsingdi Sadar', 'Palash', 'Shibpur', 'Raipura', 'Monohardi'],
      },
      {
        name: 'Gopalganj',
        thanas: ['Gopalganj Sadar', 'Tungipara', 'Kotalipara', 'Kashiani', 'Muksudpur'],
      },
      {
        name: 'Madaripur',
        thanas: ['Madaripur Sadar', 'Shibchar', 'Rajoir', 'Kalkini'],
      },
      {
        name: 'Rajbari',
        thanas: ['Rajbari Sadar', 'Pangsha', 'Goalanda', 'Baliakandi'],
      },
      {
        name: 'Shariatpur',
        thanas: ['Shariatpur Sadar', 'Zanjira', 'Naria', 'Damudya', 'Gosairhat'],
      },
      {
        name: 'Kishoreganj',
        thanas: ['Kishoreganj Sadar', 'Bhairab', 'Katiadi', 'Kuliarchar', 'Pakundia'],
      },
    ],
  },
  {
    division: 'Chattogram',
    districts: [
      {
        name: 'Chattogram',
        thanas: [
          'Kotwali',
          'Panchlaish',
          'Halishahar',
          'Agrabad',
          'Khulshi',
          'Double Mooring',
          'Bayezid',
          'Patenga',
          'Hathazari',
          'Sitakunda',
          'Patiya',
          'Raozan',
        ],
      },
      {
        name: "Cox's Bazar",
        thanas: ["Cox's Bazar Sadar", 'Teknaf', 'Ukhia', 'Ramu', 'Chakaria', 'Maheshkhali'],
      },
      {
        name: 'Cumilla',
        thanas: ['Cumilla Sadar', 'Laksam', 'Daudkandi', 'Chandina', 'Burichang', 'Chauddagram'],
      },
      {
        name: 'Feni',
        thanas: ['Feni Sadar', 'Daganbhuiyan', 'Chhagalnaiya', 'Parshuram', 'Sonagazi'],
      },
      {
        name: 'Noakhali',
        thanas: ['Noakhali Sadar', 'Begumganj', 'Chatkhil', 'Senbagh', 'Subarnachar', 'Hatiya'],
      },
      {
        name: 'Brahmanbaria',
        thanas: ['Brahmanbaria Sadar', 'Ashuganj', 'Kasba', 'Nabinagar', 'Sarail'],
      },
      {
        name: 'Chandpur',
        thanas: ['Chandpur Sadar', 'Hajiganj', 'Matlab North', 'Matlab South', 'Shahrasti'],
      },
      {
        name: 'Lakshmipur',
        thanas: ['Lakshmipur Sadar', 'Ramganj', 'Raipur', 'Ramgati'],
      },
    ],
  },
  {
    division: 'Rajshahi',
    districts: [
      {
        name: 'Rajshahi',
        thanas: ['Boalia', 'Rajpara', 'Motihar', 'Shah Makhdum', 'Paba', 'Godagari', 'Tanore', 'Bagha'],
      },
      {
        name: 'Bogra',
        thanas: ['Bogra Sadar', 'Sherpur', 'Shajahanpur', 'Ghabtali', 'Dhunat', 'Shibganj'],
      },
      {
        name: 'Pabna',
        thanas: ['Pabna Sadar', 'Ishwardi', 'Santhia', 'Sujanagar', 'Bera'],
      },
      {
        name: 'Naogaon',
        thanas: ['Naogaon Sadar', 'Mohadevpur', 'Manda', 'Niamatpur', 'Patnitala'],
      },
      {
        name: 'Natore',
        thanas: ['Natore Sadar', 'Baraigram', 'Singra', 'Gurudaspur', 'Lalpur'],
      },
    ],
  },
  {
    division: 'Khulna',
    districts: [
      {
        name: 'Khulna',
        thanas: ['Khulna Sadar', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Khan Jahan Ali', 'Rupsha', 'Batiaghata', 'Dumuria'],
      },
      {
        name: 'Jessore',
        thanas: ['Jessore Sadar', 'Jhikargachha', 'Sharsha', 'Manirampur', 'Abhaynagar', 'Bagherpara'],
      },
      {
        name: 'Kushtia',
        thanas: ['Kushtia Sadar', 'Kumarkhali', 'Bheramara', 'Mirpur', 'Daulatpur'],
      },
      {
        name: 'Satkhira',
        thanas: ['Satkhira Sadar', 'Kalaroa', 'Tala', 'Shyamnagar', 'Kaliganj'],
      },
    ],
  },
  {
    division: 'Barishal',
    districts: [
      {
        name: 'Barishal',
        thanas: ['Kotwali', 'Airport', 'Kawnia', 'Babuganj', 'Bakerganj', 'Gournadi', 'Agailjhara'],
      },
      {
        name: 'Bhola',
        thanas: ['Bhola Sadar', 'Borhanuddin', 'Lalmohan', 'Char Fasson', 'Daulatkhan'],
      },
      {
        name: 'Patuakhali',
        thanas: ['Patuakhali Sadar', 'Galachipa', 'Kalapara', 'Bauphal', 'Mirzaganj'],
      },
    ],
  },
  {
    division: 'Sylhet',
    districts: [
      {
        name: 'Sylhet',
        thanas: ['Kotwali', 'Shah Poran', 'Airport', 'South Surma', 'Beanibazar', 'Golapganj', 'Gowainghat'],
      },
      {
        name: 'Moulvibazar',
        thanas: ['Moulvibazar Sadar', 'Sreemangal', 'Kulaura', 'Kamalganj', 'Barlekha'],
      },
      {
        name: 'Habiganj',
        thanas: ['Habiganj Sadar', 'Madhabpur', 'Chhatak', 'Nabiganj', 'Bahubal'],
      },
    ],
  },
  {
    division: 'Rangpur',
    districts: [
      {
        name: 'Rangpur',
        thanas: ['Rangpur Sadar', 'Kotwali', 'Tajhat', 'Mithapukur', 'Pirganj', 'Badarganj', 'Kaunia'],
      },
      {
        name: 'Dinajpur',
        thanas: ['Dinajpur Sadar', 'Phulbari', 'Birampur', 'Parbatipur', 'Biral'],
      },
      {
        name: 'Gaibandha',
        thanas: ['Gaibandha Sadar', 'Gobindaganj', 'Palashbari', 'Sundarganj'],
      },
    ],
  },
  {
    division: 'Mymensingh',
    districts: [
      {
        name: 'Mymensingh',
        thanas: ['Kotwali', 'Muktagachha', 'Bhaluka', 'Trishal', 'Gafargaon', 'Fulbaria'],
      },
      {
        name: 'Jamalpur',
        thanas: ['Jamalpur Sadar', 'Sarishabari', 'Melandaha', 'Islampur'],
      },
      {
        name: 'Netrokona',
        thanas: ['Netrokona Sadar', 'Kendua', 'Mohanganj', 'Durgapur'],
      },
    ],
  },
];

export function getDivisions(): string[] {
  return BANGLADESH_LOCATIONS.map((loc) => loc.division);
}

export function getDistrictsByDivision(divisionName: string): string[] {
  const match = BANGLADESH_LOCATIONS.find(
    (loc) => loc.division.toLowerCase() === divisionName.toLowerCase()
  );
  return match ? match.districts.map((d) => d.name) : [];
}

export function getThanasByDistrict(divisionName: string, districtName: string): string[] {
  const divMatch = BANGLADESH_LOCATIONS.find(
    (loc) => loc.division.toLowerCase() === divisionName.toLowerCase()
  );
  if (!divMatch) return [];
  const distMatch = divMatch.districts.find(
    (d) => d.name.toLowerCase() === districtName.toLowerCase()
  );
  return distMatch ? distMatch.thanas : [];
}
