import streamlit as st
from transformer.app import AcademicTextHumanizer, load_spacy_model, download_nltk_resources
from nltk.tokenize import word_tokenize
import io


@st.cache_resource
def load_humanizer_model(seed=None):
    """
    Load and cache the AcademicTextHumanizer model for better performance.
    """
    return AcademicTextHumanizer(
        p_passive=0.3,
        p_synonym_replacement=0.3,
        p_academic_transition=0.4,
        seed=seed
    )


def main():
    """
    The `main` function sets up a Streamlit page for transforming user-provided text into a more formal
    academic style by expanding contractions, adding academic transitions, and optionally converting
    sentences to passive voice or replacing words with synonyms.
    """
    # Download NLTK resources if needed
    download_nltk_resources()

    # Configure Streamlit page
    st.set_page_config(
        page_title="Humanize AI Generated text",
        page_icon="🤖",
        layout="wide",
        initial_sidebar_state="expanded",
        menu_items={
            'Get Help': "https://github.com/DadaNanjesha/AI-Text-Humanizer-App/issues",
            'Report a bug': "https://github.com/DadaNanjesha/AI-Text-Humanizer-App/issues",
            'About': "# This app is used to Humanize AI generated text"
        }
    )

    # --- Custom CSS for Title Centering and Additional Styling ---
    st.markdown(
        """
        <style>
        /* Center the main title */
        .title {
            text-align: center;
            font-size: 2em;
            font-weight: bold;
            margin-top: 0.5em;
        }
        /* Center the subtitle / introduction block */
        .intro {
            text-align: left;
            line-height: 1.6;
            margin-bottom: 1.2em;
        }
        </style>
        """,
        unsafe_allow_html=True
    )

    # --- Title / Intro ---
    st.markdown("<div class='title'>🧔🏻‍♂️Humanize AI🤖 Generated text</div>", unsafe_allow_html=True)
    st.markdown(
        """
        <div class='intro'>
        <p><b>This app transforms your text into a more formal academic style by:<b><br>
        • Expanding contractions<br>
        • Adding academic transitions<br>
        • <em>Optionally</em> converting some sentences to passive voice<br>
        • <em>Optionally</em> replacing words with synonyms for a more formal tone.</p>
        <hr>
        </div>
        """,
        unsafe_allow_html=True
    )

    # Sidebar for options
    with st.sidebar:
        st.header("⚙️ Transformation Options")
        use_passive = st.checkbox("Enable Passive Voice Transformation", value=False)
        use_synonyms = st.checkbox("Enable Synonym Replacement", value=False)
        
        st.divider()
        
        st.header("🎲 Advanced Settings")
        use_seed = st.checkbox("Enable Reproducible Results", value=False)
        seed_value = None
        if use_seed:
            seed_value = st.number_input("Random Seed", min_value=0, max_value=9999, value=42, step=1)

    # Text input
    user_text = st.text_area("Enter your text here:", height=200)

    # File upload
    uploaded_file = st.file_uploader("Or upload a .txt file:", type=["txt"])
    if uploaded_file is not None:
        try:
            file_text = uploaded_file.read().decode("utf-8", errors="ignore")
            user_text = file_text
            st.success("✅ File uploaded successfully!")
        except Exception as e:
            st.error(f"❌ Error reading file: {str(e)}")

    # Button
    if st.button("Transform to Academic Style", type="primary"):
        if not user_text.strip():
            st.warning("⚠️ Please enter or upload some text to transform.")
        else:
            try:
                # Progress container
                progress_bar = st.progress(0)
                status_text = st.empty()
                
                # Step 1: Loading models
                status_text.text("📚 Loading models...")
                progress_bar.progress(10)
                humanizer = load_humanizer_model(seed=seed_value if use_seed else None)
                nlp_model = load_spacy_model()
                
                # Step 2: Analyzing input
                status_text.text("🔍 Analyzing input text...")
                progress_bar.progress(30)
                input_word_count = len(word_tokenize(user_text, language='english', preserve_line=True))
                doc_input = nlp_model(user_text)
                input_sentence_count = len(list(doc_input.sents))

                # Step 3: Transforming text
                status_text.text("✨ Transforming text...")
                progress_bar.progress(50)
                transformed = humanizer.humanize_text(
                    user_text,
                    use_passive=use_passive,
                    use_synonyms=use_synonyms
                )

                # Step 4: Analyzing output
                status_text.text("📊 Calculating statistics...")
                progress_bar.progress(80)
                output_word_count = len(word_tokenize(transformed, language='english', preserve_line=True))
                doc_output = nlp_model(transformed)
                output_sentence_count = len(list(doc_output.sents))
                
                # Complete
                progress_bar.progress(100)
                status_text.text("✅ Transformation complete!")

                # Output
                st.divider()
                st.subheader("📝 Transformed Text:")
                st.text_area("", value=transformed, height=300, key="output", disabled=True)

                # Statistics
                col1, col2, col3, col4 = st.columns(4)
                with col1:
                    st.metric("Input Words", input_word_count)
                with col2:
                    st.metric("Input Sentences", input_sentence_count)
                with col3:
                    st.metric("Output Words", output_word_count, delta=output_word_count - input_word_count)
                with col4:
                    st.metric("Output Sentences", output_sentence_count, delta=output_sentence_count - input_sentence_count)

                # Export functionality
                st.divider()
                col_download, col_copy = st.columns([1, 3])
                
                with col_download:
                    # Download button
                    txt_file = io.BytesIO(transformed.encode('utf-8'))
                    st.download_button(
                        label="📥 Download as TXT",
                        data=txt_file,
                        file_name="humanized_text.txt",
                        mime="text/plain",
                        use_container_width=True
                    )
                
                # Clear progress indicators
                progress_bar.empty()
                status_text.empty()
                
            except Exception as e:
                st.error(f"❌ An error occurred during transformation: {str(e)}")
                st.info("💡 Tip: Try with a shorter text or check if all models are properly installed.")

    st.markdown("---")


if __name__ == "__main__":
    main()