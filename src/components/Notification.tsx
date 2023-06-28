import { useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/solid';
import useNotificationStore from '../stores/useNotificationStore';
import { useConnection } from '@solana/wallet-adapter-react';
import { getExplorerUrl } from '../utils/explorer';
import { useNetworkConfiguration } from 'contexts/NetworkConfigurationProvider';

const NotificationList = () => {
  const { notifications, set: setNotificationStore } = useNotificationStore(
    (s) => s
  );

  const reversedNotifications = [...notifications].reverse();

  return (
    <div className="fixed top-4 right-4 flex flex-col items-end z-50 pointer-events-none">
      {reversedNotifications.map((n, idx) => (
        <Notification
          key={`${n.message}${idx}`}
          type={n.type}
          message={n.message}
          description={n.description}
          txid={n.txid}
          onHide={() => {
            setNotificationStore((state) => {
              const reversedIndex = reversedNotifications.length - 1 - idx;
              state.notifications = [
                ...notifications.slice(0, reversedIndex),
                ...notifications.slice(reversedIndex + 1),
              ];
            });
          }}
        />
      ))}
    </div>
  );
};

const Notification = ({ type, message, description, txid, onHide }) => {
  const { connection } = useConnection();
  const { networkConfiguration } = useNetworkConfiguration();

  useEffect(() => {
    const id = setTimeout(() => {
      onHide();
    }, 8000);

    return () => {
      clearTimeout(id);
    };
  }, [onHide]);

  return (
    <div className="max-w-sm w-full mb-2 pointer-events-auto">
      <div className="flex items-center bg-gradient-to-r from-purple-900 from-10% via-purple-600 via-30% to-emerald-500 to-90% p-4 rounded-md shadow-lg">
        <div className="flex-1">
          <div className="font-bold text-fgd-1">{message}</div>
          {description && (
            <p className="mt-0.5 text-sm text-fgd-2">{description}</p>
          )}
          {txid && (
            <div className="flex flex-row">
              <a
                href={`https://explorer.solana.com/tx/${txid}?cluster=${networkConfiguration}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-row link link-accent text-emerald-200"
              >
                <svg
                  className="flex-shrink-0 h-4 ml-2 mt-0.5 text-primary-light w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  ></path>
                </svg>
                <div className="flex mx-4">
                  {txid.slice(0, 8)}...
                  {txid.slice(txid.length - 8)}
                </div>
              </a>
            </div>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 self-start flex">
          <button
            onClick={onHide}
            className="bg-bkg-2 default-transition rounded-md inline-flex text-fgd-3 hover:text-fgd-4 focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationList;
