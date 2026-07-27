import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Accordion, Button, TextInput } from '@krds-community/react';
import '@krds-community/react/styles.css';

function App() {
  const [value, setValue] = useState('');
  return (
    <main style={{ maxWidth: 720, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>KRDS Playground</h1>
      <TextInput
        label="입력"
        hint="컨트롤된 React 값"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <p>Current value: {value || '(empty)'}</p>
      <Button onClick={() => setValue('버튼으로 설정됨')}>값 설정</Button>
      <Accordion
        items={[
          {
            id: 'details',
            title: '상세 보기',
            content: '컴포넌트는 React 네이티브 API를 사용합니다.',
          },
        ]}
      />
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
