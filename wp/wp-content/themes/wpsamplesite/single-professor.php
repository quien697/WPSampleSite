<?php
/**
 * The template for displaying all professor event.
 *
 */
?>
<?php get_header(); ?>

<?php while ( have_posts() ) {
	the_post();
	pageBanner();
?>
	<div class="container container--narrow page-section">
		<div class="generic-content">
            <div class="row group">
                <div class="one-third">
                    <?php the_post_thumbnail('professorPortrait'); ?>
                </div>
                <div class="two-thirds">
                    <?php the_content(); ?>
                </div>
            </div>
        </div>
		<?php
		$relatedPrograms = get_field('related_programs');
		if ($relatedPrograms) {
            echo '<hr class="section-break">';
            echo '<h2 class="headline headline--medium">Related Programs</h2>';
            echo '<ul class="link-list min-list">';
                foreach ($relatedPrograms as $program) {
        ?>
                    <li>
                        <a href="<?php echo get_the_permalink($program); ?>">
                            <?php echo get_the_title($program); ?>
                        </a>
                    </li>
                <?php } ?>
		    <ul>
        <?php } ?>
	</div>
	<hr>
<?php } ?>

<?php get_footer(); ?>