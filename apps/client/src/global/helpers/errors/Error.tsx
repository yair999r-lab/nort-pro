import ErrorIcon from '@/global/icons/ErrorIcon';
import { Typography } from '@mui/material';
import { CSSProperties, FC, ReactNode } from 'react';

type ErrorProps = {
  status?: number;
  children?: ReactNode;
  style?: CSSProperties;
  message: string;
  isTitleDisplay?: boolean;
};

const Error: FC<ErrorProps> = ({
  message,
  status = 500,
  children,
  isTitleDisplay = true,
  style,
}) => {
  const ERROR_MESSAGE =
    message === 'Network Error' ? 'שגיאה בהתחברות לשרת!' : message;

  return (
    <div className="center" style={{ width: '100%', height: '100%', ...style }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        {isTitleDisplay && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ErrorIcon scale={1} color="#f4ff5dee" height={50} />
              {status && (
                <Typography variant="h4" component="h1" color='white'>
                  שגיאה: {String(status)}
                </Typography>
              )}
            </div>
            <hr style={{ border: '1px solid #f4ff5dee' }} />
          </div>
        )}
        <Typography variant="h6" component="h2" color='white'>
          {ERROR_MESSAGE}
        </Typography>

        {children && (
          <div
            style={{
              paddingTop: '12px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default Error;
