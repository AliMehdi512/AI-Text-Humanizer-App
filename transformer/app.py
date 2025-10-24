import ssl
import random
import warnings
from typing import Optional

import nltk
import spacy
from nltk.tokenize import word_tokenize
from nltk.corpus import wordnet
from sentence_transformers import SentenceTransformer, util

warnings.filterwarnings("ignore", category=FutureWarning)

# Global spaCy model - loaded once and reused
NLP_GLOBAL = None

def load_spacy_model():
    """
    Lazy loading of spaCy model with error handling.
    """
    global NLP_GLOBAL
    if NLP_GLOBAL is None:
        try:
            NLP_GLOBAL = spacy.load("en_core_web_sm")
        except Exception as e:
            print(f"Error loading spaCy model: {str(e)}")
            print("Please run: python -m spacy download en_core_web_sm")
            raise
    return NLP_GLOBAL

def download_nltk_resources():
    """
    Download required NLTK resources if not already installed.
    """
    try:
        _create_unverified_https_context = ssl._create_unverified_context
    except AttributeError:
        pass
    else:
        ssl._create_default_https_context = _create_unverified_https_context

    resources = ['punkt', 'averaged_perceptron_tagger', 'punkt_tab','wordnet','averaged_perceptron_tagger_eng']
    for resource in resources:
        try:
            nltk.download(resource, quiet=True)
        except Exception as e:
            print(f"Error downloading {resource}: {str(e)}")


# This class  contains methods to humanize academic text, such as improving readability or
# simplifying complex language.
class AcademicTextHumanizer:
    """
    Transforms text into a more formal (academic) style:
      - Expands contractions
      - Adds academic transitions
      - Optionally converts some sentences to passive voice
      - Optionally replaces words with synonyms for more formality
    """

    def __init__(
        self,
        model_name='paraphrase-MiniLM-L6-v2',
        p_passive=0.2,
        p_synonym_replacement=0.3,
        p_academic_transition=0.3,
        seed=None
    ):
        """
        Initialize the AcademicTextHumanizer with models and parameters.
        
        Args:
            model_name: Name of the sentence transformer model
            p_passive: Probability of passive voice conversion
            p_synonym_replacement: Probability of synonym replacement
            p_academic_transition: Probability of adding academic transitions
            seed: Random seed for reproducibility
        """
        if seed is not None:
            random.seed(seed)

        try:
            self.nlp = load_spacy_model()
            self.model = self._load_sentence_transformer_with_fallback(model_name)
        except Exception as e:
            print(f"Error loading models: {str(e)}")
            raise

        # Transformation probabilities
        self.p_passive = p_passive
        self.p_synonym_replacement = p_synonym_replacement
        self.p_academic_transition = p_academic_transition

        # Common academic transitions
        self.academic_transitions = [
            "Moreover,", "Additionally,", "Furthermore,", "Hence,", 
            "Therefore,", "Consequently,", "Nonetheless,", "Nevertheless,"
        ]

    def _load_sentence_transformer_with_fallback(self, model_name):
        """
        Load sentence transformer with fallback mechanisms for Hugging Face timeout issues.
        """
        import time
        import requests
        
        # List of fallback models (smaller, faster models)
        fallback_models = [
            'paraphrase-MiniLM-L6-v2',
            'all-MiniLM-L6-v2',
            'all-MiniLM-L12-v2'
        ]
        
        # Try the requested model first
        models_to_try = [model_name] + [m for m in fallback_models if m != model_name]
        
        for i, model in enumerate(models_to_try):
            try:
                print(f"🔄 Attempting to load model: {model} (attempt {i+1}/{len(models_to_try)})")
                
                # Set a timeout for the model loading
                import os
                os.environ['HF_HUB_DOWNLOAD_TIMEOUT'] = '30'  # 30 second timeout
                
                # Try to load the model
                model_instance = SentenceTransformer(model)
                print(f"✅ Successfully loaded model: {model}")
                return model_instance
                
            except Exception as e:
                print(f"❌ Failed to load model {model}: {str(e)}")
                if i < len(models_to_try) - 1:
                    print(f"🔄 Trying next fallback model...")
                    time.sleep(2)  # Wait 2 seconds before trying next model
                else:
                    print(f"⚠️ All models failed to load. Running without sentence transformer model.")
                    return None
        
        return None

    def humanize_text(self, text, use_passive=False, use_synonyms=False):
        """
        Transform text to a more formal academic style.
        
        Args:
            text: Input text to transform
            use_passive: Whether to apply passive voice conversion
            use_synonyms: Whether to apply synonym replacement
            
        Returns:
            Transformed text string
        """
        if not text or not text.strip():
            return text
            
        try:
            doc = self.nlp(text)
            transformed_sentences = []

            for sent in doc.sents:
                sentence_str = sent.text.strip()
                
                if not sentence_str:
                    continue

                # 1. Expand contractions
                sentence_str = self.expand_contractions(sentence_str)

                # 2. Possibly add academic transitions
                if random.random() < self.p_academic_transition:
                    sentence_str = self.add_academic_transitions(sentence_str)

                # 3. Optionally convert to passive
                if use_passive and random.random() < self.p_passive:
                    sentence_str = self.convert_to_passive(sentence_str)

                # 4. Optionally replace words with synonyms
                if use_synonyms and random.random() < self.p_synonym_replacement:
                    sentence_str = self.replace_with_synonyms(sentence_str)

                transformed_sentences.append(sentence_str)

            return ' '.join(transformed_sentences)
        except Exception as e:
            print(f"Error in humanize_text: {str(e)}")
            return text

    def expand_contractions(self, sentence):
        """
        Expands common contractions while preserving punctuation and spacing.
        """
        contraction_map = {
            "n't": " not", "'re": " are", "'s": " is", "'ll": " will",
            "'ve": " have", "'d": " would", "'m": " am",
            # Handle contractions without apostrophes
            "dont": "do not", "wont": "will not", "cant": "cannot",
            "shouldnt": "should not", "wouldnt": "would not", "couldnt": "could not",
            "havent": "have not", "hasnt": "has not", "hadnt": "had not",
            "isnt": "is not", "arent": "are not", "wasnt": "was not", "werent": "were not"
        }
        try:
            tokens = word_tokenize(sentence)
            expanded_tokens = []
            for token in tokens:
                lower_token = token.lower()
                replaced = False
                for contraction, expansion in contraction_map.items():
                    if contraction in lower_token and lower_token.endswith(contraction):
                        new_token = lower_token.replace(contraction, expansion)
                        if token[0].isupper():
                            new_token = new_token.capitalize()
                        expanded_tokens.append(new_token)
                        replaced = True
                        break
                    # Handle exact matches for contractions without apostrophes
                    elif lower_token == contraction:
                        new_token = expansion
                        if token[0].isupper():
                            new_token = new_token.capitalize()
                        expanded_tokens.append(new_token)
                        replaced = True
                        break
                if not replaced:
                    expanded_tokens.append(token)

            # Improved spacing: don't add space before punctuation
            result = []
            for i, token in enumerate(expanded_tokens):
                if i == 0:
                    result.append(token)
                elif token in ".,!?;:')]}":
                    result.append(token)
                elif expanded_tokens[i-1] in "([{":
                    result.append(token)
                else:
                    result.append(' ' + token)
            
            return ''.join(result)
        except Exception as e:
            print(f"Error in expand_contractions: {str(e)}")
            return sentence

    def add_academic_transitions(self, sentence):
        transition = random.choice(self.academic_transitions)
        return f"{transition} {sentence}"

    def convert_to_passive(self, sentence):
        """
        Converts active voice sentences to passive voice with proper auxiliary verbs.
        """
        try:
            doc = self.nlp(sentence)
            subj_tokens = [t for t in doc if t.dep_ == 'nsubj' and t.head.dep_ == 'ROOT']
            dobj_tokens = [t for t in doc if t.dep_ == 'dobj']

            if subj_tokens and dobj_tokens:
                subject = subj_tokens[0]
                dobj = dobj_tokens[0]
                verb = subject.head
                
                if subject.i < verb.i < dobj.i:
                    # Determine proper auxiliary verb based on tense and subject
                    aux_verb = "was"
                    if verb.tag_ in ['VBP', 'VB', 'VBZ']:  # Present tense
                        aux_verb = "is" if verb.tag_ == 'VBZ' else "are"
                    elif verb.tag_ in ['VBD']:  # Past tense
                        aux_verb = "was"
                    elif verb.tag_ == 'VBN':  # Past participle
                        aux_verb = "been"
                    
                    # Get past participle form of verb
                    past_participle = verb.text
                    if verb.tag_ not in ['VBN']:  # If not already past participle
                        # Simple heuristic for past participle
                        if verb.lemma_.endswith('e'):
                            past_participle = verb.lemma_ + 'd'
                        elif verb.lemma_.endswith('y'):
                            past_participle = verb.lemma_[:-1] + 'ied'
                        else:
                            past_participle = verb.lemma_ + 'ed'
                    
                    # Capitalize if object was at start of sentence
                    dobj_text = dobj.text.capitalize() if subject.i == 0 else dobj.text
                    
                    passive_str = f"{dobj_text} {aux_verb} {past_participle} by {subject.text.lower()}"
                    
                    # Build original phrase to replace
                    original_tokens = [t for t in doc if subject.i <= t.i <= dobj.i]
                    original_str = ' '.join(token.text for token in doc)
                    chunk = ' '.join(t.text for t in original_tokens)
                    
                    if chunk in original_str:
                        sentence = original_str.replace(chunk, passive_str, 1)
            
            return sentence
        except Exception as e:
            print(f"Error in convert_to_passive: {str(e)}")
            return sentence

    def replace_with_synonyms(self, sentence):
        """
        Replaces words with semantically similar synonyms while preserving punctuation.
        """
        try:
            tokens = word_tokenize(sentence)
            pos_tags = nltk.pos_tag(tokens)

            new_tokens = []
            for (word, pos) in pos_tags:
                if pos.startswith(('J', 'N', 'V', 'R')) and wordnet.synsets(word):
                    if random.random() < 0.5:
                        synonyms = self._get_synonyms(word, pos)
                        if synonyms:
                            best_synonym = self._select_closest_synonym(word, synonyms)
                            new_tokens.append(best_synonym if best_synonym else word)
                        else:
                            new_tokens.append(word)
                    else:
                        new_tokens.append(word)
                else:
                    new_tokens.append(word)

            # Improved spacing: don't add space before punctuation
            result = []
            for i, token in enumerate(new_tokens):
                if i == 0:
                    result.append(token)
                elif token in ".,!?;:')]}":
                    result.append(token)
                elif new_tokens[i-1] in "([{":
                    result.append(token)
                else:
                    result.append(' ' + token)
            
            return ''.join(result)
        except Exception as e:
            print(f"Error in replace_with_synonyms: {str(e)}")
            return sentence

    def _get_synonyms(self, word, pos):
        """
        Retrieves synonyms from WordNet based on POS tag.
        """
        try:
            wn_pos = None
            if pos.startswith('J'):
                wn_pos = wordnet.ADJ
            elif pos.startswith('N'):
                wn_pos = wordnet.NOUN
            elif pos.startswith('R'):
                wn_pos = wordnet.ADV
            elif pos.startswith('V'):
                wn_pos = wordnet.VERB

            synonyms = set()
            for syn in wordnet.synsets(word, pos=wn_pos):
                for lemma in syn.lemmas():
                    lemma_name = lemma.name().replace('_', ' ')
                    if lemma_name.lower() != word.lower():
                        synonyms.add(lemma_name)
            return list(synonyms)
        except Exception as e:
            print(f"Error in _get_synonyms: {str(e)}")
            return []

    def _select_closest_synonym(self, original_word, synonyms):
        """
        Selects the semantically closest synonym using sentence transformers.
        Falls back to random selection if model is not available.
        """
        try:
            if not synonyms:
                return None
            
            # If model is not available, use simple random selection
            if self.model is None:
                print("⚠️ Sentence transformer model not available, using random synonym selection")
                return random.choice(synonyms)
            
            original_emb = self.model.encode(original_word, convert_to_tensor=True)
            synonym_embs = self.model.encode(synonyms, convert_to_tensor=True)
            cos_scores = util.cos_sim(original_emb, synonym_embs)[0]
            max_score_index = cos_scores.argmax().item()
            max_score = cos_scores[max_score_index].item()
            if max_score >= 0.5:
                return synonyms[max_score_index]
            return None
        except Exception as e:
            print(f"Error in _select_closest_synonym: {str(e)}")
            # Fallback to random selection
            if synonyms:
                return random.choice(synonyms)
            return None