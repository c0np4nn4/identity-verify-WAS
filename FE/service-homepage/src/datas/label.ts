export interface ILabel {
    label: string;
    options: string[];
}

export const SexLabel: ILabel = {
    label: '성별',
    options: ['남성', '여성'],
};

export const AgeLabel: ILabel = {
    label: '나이',
    options: ['10대', '20대', '30대', '40대', '50대', '60대 이상'],
};

export const HeightLabel: ILabel = {
    label: '키',
    options: [
        '150cm 이하',
        '150cm ~ 160cm',
        '160cm ~ 170cm',
        '170cm ~ 180cm',
        '180cm 이상',
    ],
};

export const BodyTypeLabel: ILabel = {
    label: '체형',
    options: ['마른', '보통', '통통', '뚱뚱'],
};

export const StyleLabel: ILabel = {
    label: '스타일',
    options: ['캐주얼', '모던', '클래식', '페미닌', '섹시', '펑키'],
};

export const HobbyLabel: ILabel = {
    label: '취미',
    options: ['운동', '예술', '요리', '독서', '여행', '게임'],
};

export const PersonalityLabel: ILabel = {
    label: '성격',
    options: ['외향적', '내향적', '낙천적', '비관적', '유머러스', '진중한'],
};

export const GlassesLabel: ILabel = {
    label: '안경',
    options: ['착용', '미착용'],
};

export const TattooLabel: ILabel = {
    label: '타투',
    options: ['있음', '없음'],
};

export const PiercingLabel: ILabel = {
    label: '피어싱',
    options: ['있음', '없음'],
};

export const ReligionLabel: ILabel = {
    label: '종교',
    options: ['기독교', '불교', '천주교', '무교', '기타'],
};

export const DrinkLabel: ILabel = {
    label: '음주',
    options: ['마시지 않음', '가끔 마심', '자주 마심'],
};

export const SmokeLabel: ILabel = {
    label: '흡연',
    options: ['비흡연', '흡연'],
};

export const BloodTypeLabel: ILabel = {
    label: '혈액형',
    options: ['A', 'B', 'O', 'AB'],
};

export const EducationLabel: ILabel = {
    label: '학력',
    options: ['고졸', '전문대졸', '대졸', '석사', '박사'],
};

export const JobLabel: ILabel = {
    label: '직업',
    options: ['학생', '회사원', '자영업', '공무원', '군인', '기타'],
};

export const LabelData: ILabel[] = [
    SexLabel,
    AgeLabel,
    HeightLabel,
    BodyTypeLabel,
    StyleLabel,
    HobbyLabel,
    PersonalityLabel,
    GlassesLabel,
    TattooLabel,
    PiercingLabel,
    ReligionLabel,
    DrinkLabel,
    SmokeLabel,
    BloodTypeLabel,
    EducationLabel,
    JobLabel,
];
