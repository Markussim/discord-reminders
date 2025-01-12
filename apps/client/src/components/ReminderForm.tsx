import { h } from 'preact';
import { useState } from 'preact/hooks';
import TagShortcuts from './TagShortcuts';

const url = "https://xcr2agxdue.execute-api.eu-north-1.amazonaws.com/prod";

const ReminderForm = () => {
    const [message, setMessage] = useState<string>('');
    const [time, setTime] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleTagClick = (discordId: string) => {
        setMessage((prev) => `${prev}<@${discordId}>`);
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const currentTime = new Date();
        const reminderTime = new Date(time);
        if (reminderTime <= currentTime) {
            setError('Please choose a future time for the reminder.');
            setIsSubmitting(false);
            return;
        }

        const isoString = reminderTime.toISOString();
        const body = { time: isoString, content: message };

        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setMessage('');
            setTime('');
        } catch (error) {
            console.error('Error submitting form:', error);
            setError('Failed to send the reminder. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const styles = {
        formContainer: {
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
            margin: '0 auto',
        },
        label: {
            marginTop: '1rem',
        },
        input: {
            marginTop: '0.5rem',
            padding: '0.5rem',
            fontSize: '1rem',
            resize: 'vertical',
        },
        button: {
            margin: '0',
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            backgroundColor: isSubmitting ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
        },
        errorMessage: {
            color: 'red',
            textAlign: 'center',
            marginTop: '1rem',
        },
    };

    return (
        <div>
            <h1 style={{ textAlign: 'center', marginTop: '2rem' }}>
                Remind someone about anything you want
            </h1>

            <form onSubmit={handleSubmit} style={styles.formContainer}>
                <label htmlFor="time" style={styles.label}>
                    Time
                </label>
                <input
                    id="time"
                    name="time"
                    type="datetime-local"
                    required
                    value={time}
                    onInput={(e) => setTime((e.target as HTMLInputElement).value)}
                    style={styles.input}
                    min={new Date().toISOString().slice(0, 16)} // Prevent pastime selection
                />

                <label htmlFor="message" style={styles.label}>
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    required
                    maxLength={1000}
                    value={message}
                    onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
                    style={{ ...styles.input, minHeight: '100px' }}
                />

                <button type="submit" disabled={isSubmitting} style={styles.button}>
                    {isSubmitting ? 'Sending...' : 'Remind'}
                </button>
            </form>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <TagShortcuts message={message} onTagClick={handleTagClick} />
        </div>
    );
};

export default ReminderForm;
