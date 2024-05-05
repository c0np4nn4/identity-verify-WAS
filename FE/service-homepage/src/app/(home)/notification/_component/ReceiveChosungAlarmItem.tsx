import { IAlarm } from '@/types/alarm';
import { useToast } from '@/stores/useToastStore';
import { useModalStore } from '@/stores/useModalStore';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { CheckLabelModal } from '@/app/(home)/notification/_component/CheckLabelModal';
import { CheckChosungModal } from '@/app/(home)/notification/_component/CheckChosungModal';

export function ReceiveChosungAlarmItem({ alarm }: { alarm: IAlarm }) {
    const { openToast } = useToast();
    let colorString = 'bg-blue-400 text-white';
    let title = '상대가 내 이름을 추측함!';

    const modalState = useModalStore();

    const onCheckLabelClick = () => {
        modalState.openModal();
    };

    return (
        <div className={`flex flex-col p-18 ${colorString}`}>
            <div className="flex items-center gap-x-12">
                <BsFillInfoCircleFill size={14} />
                <h2 className="text-18">{title}</h2>
                <label className="text-12 ml-auto">
                    {new Date(alarm.createdAt).toLocaleString('ko-KR')}
                </label>
            </div>
            <div className={'flex gap-x-8'}>
                <p className="text-16 mt-12">{alarm.text}</p>
                <div className={'flex gap-x-4 ml-auto'}>
                    <button
                        onClick={onCheckLabelClick}
                        className={
                            'bg-white text-black text-16 rounded-4 px-8 py-1 items-center flex'
                        }
                    >
                        확인하기
                    </button>
                </div>
            </div>
            <CheckChosungModal
                name={alarm.matchLog.name as string}
                targetPk={alarm.matchLog.targetPk}
            />
        </div>
    );
}
